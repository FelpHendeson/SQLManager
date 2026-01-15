export type ScriptBlock = {
  id: string;
  type: "DECLARE" | "BEGIN" | "END" | "STATEMENT";
  summary: string;
  content: string;
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
  dependencies: ScriptDependency[];
  createdAt: string;
};
