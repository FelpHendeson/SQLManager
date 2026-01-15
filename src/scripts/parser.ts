import crypto from "crypto";
import { ScriptArtifact, ScriptBlock, ScriptDependency } from "./models.js";

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

const extractDependencies = (sql: string): ScriptDependency[] => {
  const tables = new Set<string>();
  const sequences = new Set<string>();

  const tableRegex = /\b(from|join|into|update)\s+([\w.]+)/gi;
  let match = tableRegex.exec(sql);
  while (match) {
    tables.add(match[2]);
    match = tableRegex.exec(sql);
  }

  const sequenceRegex = /\b([\w.]+)\.nextval\b/gi;
  let sequenceMatch = sequenceRegex.exec(sql);
  while (sequenceMatch) {
    sequences.add(sequenceMatch[1]);
    sequenceMatch = sequenceRegex.exec(sql);
  }

  return [
    ...Array.from(tables).map((name) => ({ type: "table" as const, name })),
    ...Array.from(sequences).map((name) => ({ type: "sequence" as const, name })),
  ];
};

export const parseSqlScript = (databaseName: string, fileName: string, rawSql: string): ScriptArtifact => {
  const blocks = splitBlocks(rawSql);
  const dependencies = extractDependencies(rawSql);

  return {
    id: crypto.randomUUID(),
    databaseName,
    fileName,
    rawSql,
    blocks,
    dependencies,
    createdAt: new Date().toISOString(),
  };
};
