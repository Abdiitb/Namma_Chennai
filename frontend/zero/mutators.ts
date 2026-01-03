import { defineMutators, defineMutator } from '@rocicorp/zero';
import { v4 as uuid } from 'uuid';
import { zql } from './schema';
import { z } from 'zod';

export const mutators = defineMutators({
  createTicket: defineMutator(
    z.object({
      created_by: z.string(),
      category: z.string(),
      title: z.string(),
      description: z.string(),
      address_text: z.string(),
      lat: z.number().nullable().optional(),
      lng: z.number().nullable().optional(),
      attachmentUrls: z.array(z.string()).optional(),
    }),
    async ({ tx, args }) => {
      const ticketId = uuid();
      await tx.mutate.tickets.insert({
        id: ticketId,
        created_by: args.created_by,
        category: args.category,
        title: args.title,
        description: args.description,
        address_text: args.address_text,
        lat: args.lat ?? null,
        lng: args.lng ?? null,
        status: 'new',
        assigned_to: null,
        current_supervisor: null,
        citizen_rating: null,
        citizen_feedback: null,
        created_at: Date.now(),
        updated_at: Date.now(),
        closed_at: null,
      });
      
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: ticketId,
        actor_id: args.created_by,
        type: 'created',
        to_status: 'new',
        created_at: Date.now(),
      });
      
      if (args.attachmentUrls?.length) {
        for (const url of args.attachmentUrls) {
          await tx.mutate.ticket_attachments.insert({
            id: uuid(),
            ticket_id: ticketId,
            uploaded_by: args.created_by,
            kind: 'photo',
            url,
            created_at: Date.now(),
          });
        }
      }
      
    }
  ),

  assignTicket: defineMutator(
    z.object({
      ticketId: z.string(),
      staffId: z.string(),
      actorId: z.string(),
    }),
    async ({ tx, args }) => {
      const ticket = await tx.run(
        zql.tickets.where('id', args.ticketId).one()
      );
      
      if (!ticket) throw new Error('Ticket not found');
      
      await tx.mutate.tickets.update({
        id: args.ticketId,
        assigned_to: args.staffId,
        status: 'assigned',
        updated_at: Date.now(),
      });
      
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: args.ticketId,
        actor_id: args.actorId,
        type: 'assigned',
        from_status: ticket.status,
        to_status: 'assigned',
        created_at: Date.now(),
      });
    }
  ),

  startWork: defineMutator(
    z.object({
      ticketId: z.string(),
      actorId: z.string(),
      message: z.string().optional(),
    }),
    async ({ tx, args }) => {
      const ticket = await tx.run(
        zql.tickets.where('id', args.ticketId).one()
      );
      
      if (!ticket) throw new Error('Ticket not found');
      
      await tx.mutate.tickets.update({
        id: args.ticketId,
        status: 'in_progress',
        updated_at: Date.now(),
      });
      
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: args.ticketId,
        actor_id: args.actorId,
        type: 'status_changed',
        from_status: ticket.status,
        to_status: 'in_progress',
        message: args.message,
        created_at: Date.now(),
      });
    }
  ),

  addStaffUpdate: defineMutator(
    z.object({
      ticketId: z.string(),
      actorId: z.string(),
      message: z.string(),
      attachmentUrls: z.array(z.string()).optional(),
    }),
    async ({ tx, args }) => {
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: args.ticketId,
        actor_id: args.actorId,
        type: 'comment',
        message: args.message,
        created_at: Date.now(),
      });
      
      if (args.attachmentUrls?.length) {
        for (const url of args.attachmentUrls) {
          await tx.mutate.ticket_attachments.insert({
            id: uuid(),
            ticket_id: args.ticketId,
            uploaded_by: args.actorId,
            kind: 'photo',
            url,
            created_at: Date.now(),
          });
        }
      }
    }
  ),

  escalateToSupervisor: defineMutator(
    z.object({
      ticketId: z.string(),
      supervisorId: z.string(),
      actorId: z.string(),
      message: z.string().optional(),
    }),
    async ({ tx, args }) => {
      const ticket = await tx.run(
        zql.tickets.where('id', args.ticketId).one()
      );
      
      if (!ticket) throw new Error('Ticket not found');
      
      await tx.mutate.tickets.update({
        id: args.ticketId,
        current_supervisor: args.supervisorId,
        status: 'waiting_supervisor',
        updated_at: Date.now(),
      });
      
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: args.ticketId,
        actor_id: args.actorId,
        type: 'escalated',
        from_status: ticket.status,
        to_status: 'waiting_supervisor',
        message: args.message,
        created_at: Date.now(),
      });
    }
  ),

  markResolved: defineMutator(
    z.object({
      ticketId: z.string(),
      actorId: z.string(),
      message: z.string().optional(),
      attachmentUrls: z.array(z.string()).optional(),
    }),
    async ({ tx, args }) => {
      const ticket = await tx.run(
        zql.tickets.where('id', args.ticketId).one()
      );
      
      if (!ticket) throw new Error('Ticket not found');
      
      await tx.mutate.tickets.update({
        id: args.ticketId,
        status: 'resolved',
        updated_at: Date.now(),
      });
      
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: args.ticketId,
        actor_id: args.actorId,
        type: 'resolved',
        from_status: ticket.status,
        to_status: 'resolved',
        message: args.message,
        created_at: Date.now(),
      });
      
      if (args.attachmentUrls?.length) {
        for (const url of args.attachmentUrls) {
          await tx.mutate.ticket_attachments.insert({
            id: uuid(),
            ticket_id: args.ticketId,
            uploaded_by: args.actorId,
            kind: 'photo',
            url,
            created_at: Date.now(),
          });
        }
      }
    }
  ),

  citizenCloseTicket: defineMutator(
    z.object({
      ticketId: z.string(),
      actorId: z.string(),
      rating: z.number(),
      feedback: z.string().optional(),
    }),
    async ({ tx, args }) => {
      const ticket = await tx.run(
        zql.tickets.where('id', args.ticketId).one()
      );
      
      if (!ticket) throw new Error('Ticket not found');
      
      await tx.mutate.tickets.update({
        id: args.ticketId,
        status: 'closed',
        closed_at: Date.now(),
        citizen_rating: args.rating,
        citizen_feedback: args.feedback,
        updated_at: Date.now(),
      });
      
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: args.ticketId,
        actor_id: args.actorId,
        type: 'closed',
        from_status: ticket.status,
        to_status: 'closed',
        created_at: Date.now(),
      });
    }
  ),

  reopenTicket: defineMutator(
    z.object({
      ticketId: z.string(),
      actorId: z.string(),
      reason: z.string().optional(),
    }),
    async ({ tx, args }) => {
      const ticket = await tx.run(
        zql.tickets.where('id', args.ticketId).one()
      );
      
      if (!ticket) throw new Error('Ticket not found');
      if (ticket.status !== 'closed') {
        throw new Error('Only closed tickets can be reopened');
      }
      
      await tx.mutate.tickets.update({
        id: args.ticketId,
        status: 'reopened',
        updated_at: Date.now(),
      });
      
      await tx.mutate.ticket_events.insert({
        id: uuid(),
        ticket_id: args.ticketId,
        actor_id: args.actorId,
        type: 'reopened',
        from_status: 'closed',
        to_status: 'reopened',
        message: args.reason,
        created_at: Date.now(),
      });
    }
  ),
});