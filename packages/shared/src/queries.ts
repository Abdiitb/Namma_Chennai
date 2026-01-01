export const ZERO_QUERIES = {
  myTickets: `
    SELECT * FROM tickets 
    WHERE created_by = $userID 
    ORDER BY created_at DESC
  `,
  
  assignedTickets: `
    SELECT * FROM tickets 
    WHERE assigned_to = $userID 
    ORDER BY updated_at DESC
  `,
  
  supervisorQueue: `
    SELECT * FROM tickets 
    WHERE current_supervisor = $userID 
    AND status = 'waiting_supervisor'
    ORDER BY updated_at ASC
  `,
  
  ticketDetail: `
    SELECT 
      t.*,
      json_agg(DISTINCT e.*) FILTER (WHERE e.id IS NOT NULL) ORDER BY e.created_at ASC as events,
      json_agg(DISTINCT a.*) FILTER (WHERE a.id IS NOT NULL) ORDER BY a.created_at ASC as attachments
    FROM tickets t
    LEFT JOIN ticket_events e ON t.id = e.ticket_id
    LEFT JOIN ticket_attachments a ON t.id = a.ticket_id
    WHERE t.id = $ticketId
    GROUP BY t.id
  `,
} as const;