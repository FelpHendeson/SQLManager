export type ObjectType = "TABLE" | "PACKAGE" | "PROCEDURE" | "FUNCTION" | "VIEW";

export type ObjectRef = {
  objectType: ObjectType;
  objectIdentifier: string;
};

export type Column = {
  id: string;
  qualifiedName: string;
  name: string;
  dataType: string | null;
  nullable: boolean;
  ordinalPosition: number;
  inferredType?: string;
  confidence?: number;
  sourceHint?: string;
  inferenceNotes?: string;
};

export type Table = {
  id: string;
  qualifiedName: string;
  name: string;
  columns: Column[];
};

export type Procedure = {
  id: string;
  qualifiedName: string;
  name: string;
  language: string;
  definition?: string;
  returnType?: string;
};

export type FunctionDefinition = {
  id: string;
  qualifiedName: string;
  name: string;
  language: string;
  definition?: string;
  returnType?: string;
};

export type Package = {
  id: string;
  qualifiedName: string;
  name: string;
  procedures: Procedure[];
  functions: FunctionDefinition[];
};

export type Schema = {
  id: string;
  qualifiedName: string;
  name: string;
  tables: Table[];
  packages: Package[];
};

export type Database = {
  id: string;
  qualifiedName: string;
  name: string;
  vendor: string;
  version?: string;
  schemas: Schema[];
};

export type Dependency = {
  id: string;
  qualifiedName: string;
  sourceObjectRef: ObjectRef;
  targetObjectRef: ObjectRef;
  type: string;
  scope: "internal" | "external";
  targetLocation?: string;
  inferredType?: string;
  confidence?: number;
  sourceHint?: string;
  inferenceNotes?: string;
};

export type Catalog = {
  databases: Database[];
  dependencies: Dependency[];
};
