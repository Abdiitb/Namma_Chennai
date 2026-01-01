// zero/queries.ts
import {defineQueries, defineQuery} from '@rocicorp/zero'
import {z} from 'zod'
import {zql} from './schema'
 
export const queries = defineQueries({
  albums: {
    byArtist: defineQuery(
      z.object({artistID: z.string()}),
      ({args: {artistID}}) =>
        zql.user
            .where('id', artistID),
    )
  }
})