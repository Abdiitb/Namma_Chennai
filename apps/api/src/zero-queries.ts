import { defineQueries, defineQuery } from '@rocicorp/zero';
import { z } from 'zod';
import { zql } from './schema';

export const ZERO_QUERIES = defineQueries({
  getTicket: defineQuery(
    z.object({
      ticketID: z.string(),
    }),
    ({ args: { ticketID } }) =>
      zql.tickets
        .where('id', ticketID)
  ),

  getTicketAttachments: defineQuery(
    z.object({
      ticketID: z.string(),
    }),
    ({ args: { ticketID } }) =>
      zql.ticket_attachments
        .where('ticket_id', ticketID)
        .orderBy('created_at', 'asc')
  ),

  allUsers: defineQuery(
    () => zql.users.orderBy('id', 'asc')
  ),

  usersByRole: defineQuery(
    z.object({
      role: z.string(),
    }),
    ({ args: { role } }) =>
      zql.users
        .where('role', role)
        .orderBy('name', 'asc')
  ),

  // Simple query to get all tickets (for development/testing)
  allTickets: defineQuery(
    () => zql.tickets.orderBy('created_at', 'desc')
  ),

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

  getUser: defineQuery(
    z.object({
      userID: z.string(),
    }),
    ({ args: { userID } }) =>
      zql.users.where('id', userID)
  ),
});
