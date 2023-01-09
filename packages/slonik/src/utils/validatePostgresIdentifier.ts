const validatePostgresIdentifier = (identifier: string) => {
  if (!identifier) {
    throw `Postgres identifier ${identifier} is empty or undefined`;
  }

  if (!Number.isNaN(Number.parseInt(identifier[0], 10))) {
    // Throw error when identifiers starts with number
    throw `Postgres identifier ${identifier} cannot start with number`;
  }

  if (identifier.startsWith("pg_")) {
    // pg_* is reserved for system schemas
    throw `Postgres identifier ${identifier} cannot start with 'pg_'`;
  }

  if (/^[\d_a-z]+$/.test(identifier)) {
    // contain only small letter, number and _
    throw `Postgres identifier ${identifier} can contain number, small letter and _`;
  }
};

export default validatePostgresIdentifier;
