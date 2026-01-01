// zero/queries.ts
import {defineQueries, defineQuery} from '@rocicorp/zero'
import {z} from 'zod'
import {zql} from './schema'
 
export const queries = defineQueries({
  users: {
    getUsers: defineQuery(
      z.object({}),
      ({ args }) => zql.user.orderBy('id'),
    ),
  },
})