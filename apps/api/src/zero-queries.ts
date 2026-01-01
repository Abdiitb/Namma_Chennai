import { defineQueries, defineQuery } from '@rocicorp/zero';
import { z } from 'zod';
import { zql } from './schema';

export const ZERO_QUERIES = defineQueries({
  myTickets: defineQuery(
    z.object({
      userID: z.string(),
    }),
    ({ args: { userID } }) =>
      zql.tickets
        .where('created_by', userID)
        .orderBy('created_at', 'desc')
  ),
  
  assignedTickets: defineQuery(
    z.object({
      userID: z.string(),
    }),
    ({ args: { userID } }) =>
      zql.tickets
        .where('assigned_to', userID)
        .orderBy('updated_at', 'desc')
  ),
  
  supervisorQueue: defineQuery(
    z.object({
      userID: z.string(),
    }),
    ({ args: { userID } }) =>
      zql.tickets
        .where('current_supervisor', userID)
        .where('status', 'waiting_supervisor')
        .orderBy('updated_at', 'asc')
  ),
  
  ticketDetail: defineQuery(
    z.object({
      ticketId: z.string(),
    }),
    ({ args: { ticketId } }) =>
      zql.tickets.where('id', ticketId)
  ),
});
