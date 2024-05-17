const typeDefs = `
scalar DateTime
scalar JSON

input Filters {
  AND: [Filters]
  OR: [Filters]
  not: Boolean
  key: String
  operator: String
  value: String
}

enum SortDirection {
  ASC
  DESC
}

input SortInput {
  key: String
  direction: SortDirection
}

type DeleteResult {
  result: Boolean!
}`;

export default typeDefs;
