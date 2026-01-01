export declare const ZERO_QUERIES: {
    readonly myTickets: "\n    SELECT * FROM tickets \n    WHERE created_by = $userID \n    ORDER BY created_at DESC\n  ";
    readonly assignedTickets: "\n    SELECT * FROM tickets \n    WHERE assigned_to = $userID \n    ORDER BY updated_at DESC\n  ";
    readonly supervisorQueue: "\n    SELECT * FROM tickets \n    WHERE current_supervisor = $userID \n    AND status = 'waiting_supervisor'\n    ORDER BY updated_at ASC\n  ";
    readonly ticketDetail: "\n    SELECT \n      t.*,\n      json_agg(DISTINCT e.*) FILTER (WHERE e.id IS NOT NULL) ORDER BY e.created_at ASC as events,\n      json_agg(DISTINCT a.*) FILTER (WHERE a.id IS NOT NULL) ORDER BY a.created_at ASC as attachments\n    FROM tickets t\n    LEFT JOIN ticket_events e ON t.id = e.ticket_id\n    LEFT JOIN ticket_attachments a ON t.id = a.ticket_id\n    WHERE t.id = $ticketId\n    GROUP BY t.id\n  ";
};
//# sourceMappingURL=queries.d.ts.map