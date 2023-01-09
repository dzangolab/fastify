const validateSchemaName = (name: string) => {
  if (!name) {
    throw "Schema name is empty or undefined";
  } else if (name.startsWith("pg_")) {
    throw "Schane name cannot start with 'pg_'";
  }
};

export default validateSchemaName;
