import { query } from './database';
import { AuthContext } from '@citizen-services/shared';

export async function getMyTickets(auth: AuthContext) {
  if (auth.role !== 'citizen') {
    throw new Error('Only citizens can view their tickets');
  }

  const result = await query(
    `SELECT * FROM tickets 
     WHERE created_by = $1 
     ORDER BY created_at DESC`,
    [auth.userID]
  );

  return result.rows;
}

export async function getAssignedTickets(auth: AuthContext) {
  if (auth.role !== 'staff') {
    throw new Error('Only staff can view assigned tickets');
  }

  const result = await query(
    `SELECT * FROM tickets 
     WHERE assigned_to = $1 
     ORDER BY updated_at DESC`,
    [auth.userID]
  );

  return result.rows;
}

export async function getSupervisorQueue(auth: AuthContext) {
  if (auth.role !== 'supervisor') {
    throw new Error('Only supervisors can view supervisor queue');
  }

  const result = await query(
    `SELECT * FROM tickets 
     WHERE current_supervisor = $1 
     AND status = 'waiting_supervisor'
     ORDER BY updated_at ASC`,
    [auth.userID]
  );

  return result.rows;
}

export async function getTicketDetail(ticketId: string, auth: AuthContext) {
  let whereClause = '';
  let params: any[] = [ticketId];

  if (auth.role === 'citizen') {
    whereClause = 'WHERE t.id = $1 AND t.created_by = $2';
    params.push(auth.userID);
  } else if (auth.role === 'staff') {
    whereClause = 'WHERE t.id = $1 AND t.assigned_to = $2';
    params.push(auth.userID);
  } else if (auth.role === 'supervisor') {
    whereClause = 'WHERE t.id = $1 AND (t.current_supervisor = $2 OR t.assigned_to = $2)';
    params.push(auth.userID);
  } else {
    whereClause = 'WHERE t.id = $1';
  }

  // Get ticket
  const ticketResult = await query(
    `SELECT * FROM tickets t ${whereClause}`,
    params
  );

  if (ticketResult.rows.length === 0) {
    throw new Error('Ticket not found or access denied');
  }

  const ticket = ticketResult.rows[0];

  // Get events
  const eventsResult = await query(
    `SELECT e.*, u.name as actor_name 
     FROM ticket_events e
     JOIN users u ON e.actor_id = u.id
     WHERE e.ticket_id = $1 
     ORDER BY e.created_at ASC`,
    [ticketId]
  );

  // Get attachments
  const attachmentsResult = await query(
    `SELECT a.*, u.name as uploaded_by_name
     FROM ticket_attachments a
     JOIN users u ON a.uploaded_by = u.id
     WHERE a.ticket_id = $1 
     ORDER BY a.created_at ASC`,
    [ticketId]
  );

  return {
    ticket,
    events: eventsResult.rows,
    attachments: attachmentsResult.rows,
  };
}