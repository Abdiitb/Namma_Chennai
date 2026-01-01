// zero/schema.ts
import {table, string, createSchema, createBuilder} from '@rocicorp/zero'
 
const user = table('user')
  .columns({
    id: string(),
    name: string(),
    email: string()
  })
  .primaryKey('id')

// ... more tables and relationships ...
// See "Schema" page in left nav for complete schema API.
 
export const schema = createSchema({
  tables: [user]
})

export const zql = createBuilder(schema)
 
// Register the schema for type safety
declare module '@rocicorp/zero' {
  interface DefaultTypes {
    schema: typeof schema
  }
}