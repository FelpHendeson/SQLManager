import crypto from "crypto";
import { ScriptArtifact, ScriptBlock, ScriptCursor, ScriptDependency, ScriptVariable } from "./models.js";

const summarize = (content: string, fallback: string): string => {
  const trimmed = content.trim().replace(/\s+/g, " ");
  return trimmed.length ? trimmed.slice(0, 120) : fallback;
};

const splitBlocks = (sql: string): ScriptBlock[] => {
  const blocks: ScriptBlock[] = [];
  const sections = sql.split(/\n\s*\/\s*\n/gi);

  sections.forEach((section) => {
    const normalized = section.trim();
    if (!normalized) {
      return;
    }

    const declareMatch = normalized.match(/declare[\s\S]*?begin/i);
    const beginMatch = normalized.match(/begin[\s\S]*?end;?/i);

    if (declareMatch) {
      const declareContent = declareMatch[0];
      blocks.push({
        id: crypto.randomUUID(),
        type: "DECLARE",
        summary: summarize(declareContent, "DECLARE"),
        content: declareContent,
      });
    }

    if (beginMatch) {
      const beginContent = beginMatch[0];
      blocks.push({
        id: crypto.randomUUID(),
        type: "BEGIN",
        summary: summarize(beginContent, "BEGIN"),
        content: beginContent,
      });

      const endMatch = beginContent.match(/end;?/i);
      if (endMatch) {
        blocks.push({
          id: crypto.randomUUID(),
          type: "END",
          summary: "END",
          content: endMatch[0],
        });
      }
      return;
    }

    const statements = normalized.split(/;\s*\n/gi).map((stmt) => stmt.trim());
    statements.forEach((statement) => {
      if (!statement) {
        return;
      }
      blocks.push({
        id: crypto.randomUUID(),
        type: "STATEMENT",
        summary: summarize(statement, "STATEMENT"),
        content: statement,
      });
    });
  });

  return blocks;
};

const extractSelectColumns = (query: string): string[] => {
  const match = query.match(/select\s+([\s\S]*?)\s+from\s+/i);
  if (!match) {
    return [];
  }
  return match[1]
    .split(",")
    .map((column) => column.trim())
    .filter(Boolean)
    .map((column) => {
      const aliasSplit = column.split(/\s+as\s+|\s+/i);
      return aliasSplit[0];
    });
};

const extractTablesFromSql = (sql: string): string[] => {
  const tables = new Set<string>();
  const tableRegex = /\b(from|join|into|update)\s+([\w.]+)/gi;
  let match = tableRegex.exec(sql);
  while (match) {
    tables.add(match[2]);
    match = tableRegex.exec(sql);
  }
  return Array.from(tables);
};

const extractSequencesFromSql = (sql: string): string[] => {
  const sequences = new Set<string>();
  const sequenceRegex = /\b([\w.]+)\.nextval\b/gi;
  let match = sequenceRegex.exec(sql);
  while (match) {
    sequences.add(match[1]);
    match = sequenceRegex.exec(sql);
  }
  return Array.from(sequences);
};

const parseDeclarations = (sql: string): { variables: ScriptVariable[]; cursors: ScriptCursor[] } => {
  const declareMatch = sql.match(/declare([\s\S]*?)begin/i);
  if (!declareMatch) {
    return { variables: [], cursors: [] };
  }
  const declareSection = declareMatch[1];
  const cursors: ScriptCursor[] = [];
  const variables: ScriptVariable[] = [];

  const cursorRegex = /cursor\s+(\w+)\s+is\s+([\s\S]*?);/gi;
  let cursorMatch = cursorRegex.exec(declareSection);
  while (cursorMatch) {
    const name = cursorMatch[1];
    const query = cursorMatch[2].trim();
    cursors.push({
      name,
      query,
      tables: extractTablesFromSql(query),
      columns: extractSelectColumns(query),
    });
    cursorMatch = cursorRegex.exec(declareSection);
  }

  const statements = declareSection
    .split(";")
    .map((stmt) => stmt.trim())
    .filter(Boolean);

  statements.forEach((statement) => {
    if (/^cursor\s+/i.test(statement)) {
      return;
    }
    const variableMatch = statement.match(/^(\w+)\s+([\w.%]+)(?:\s*:=\s*([\s\S]+))?$/i);
    if (!variableMatch) {
      return;
    }
    const [, name, dataType, defaultValue] = variableMatch;
    variables.push({
      name,
      dataType,
      defaultValue: defaultValue?.trim(),
      isCursorBased: /%rowtype/i.test(dataType),
    });
  });

  return { variables, cursors };
};

const extractDependencies = (sql: string): ScriptDependency[] => {
  const tables = extractTablesFromSql(sql);
  const sequences = extractSequencesFromSql(sql);
  return [
    ...tables.map((name) => ({ type: "table" as const, name })),
    ...sequences.map((name) => ({ type: "sequence" as const, name })),
  ];
};

export const parseSqlScript = (databaseName: string, fileName: string, rawSql: string): ScriptArtifact => {
  const blocks = splitBlocks(rawSql);
  const { variables, cursors } = parseDeclarations(rawSql);
  const dependencies = extractDependencies(rawSql);

  return {
    id: crypto.randomUUID(),
    databaseName,
    fileName,
    rawSql,
    blocks,
    variables,
    cursors,
    dependencies,
    createdAt: new Date().toISOString(),
  };
};
