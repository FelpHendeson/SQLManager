export type ScriptBlock = {
  id: string;
  type: "DECLARE" | "BEGIN" | "END" | "STATEMENT";
  summary: string;
  content: string;
};

export type ScriptVariable = {
  name: string;
  dataType: string;
  defaultValue?: string;
  isCursorBased?: boolean;
};

export type ScriptCursor = {
  name: string;
  query: string;
  tables: string[];
  columns: string[];
};

export type ScriptDependency = {
  type: "table" | "sequence";
  name: string;
};

export type ScriptArtifact = {
  id: string;
  databaseName: string;
  fileName: string;
  rawSql: string;
  blocks: ScriptBlock[];
  variables: ScriptVariable[];
  cursors: ScriptCursor[];
  dependencies: ScriptDependency[];
  createdAt: string;
};
