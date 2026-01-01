"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = createTicket;
exports.assignTicket = assignTicket;
exports.startWork = startWork;
exports.addStaffUpdate = addStaffUpdate;
exports.escalateToSupervisor = escalateToSupervisor;
exports.markResolved = markResolved;
exports.citizenCloseTicket = citizenCloseTicket;
exports.reopenTicket = reopenTicket;
const uuid_1 = require("uuid");
const database_1 = require("./database");
async function checkTicketAccess(ticketId, userID, role) {
    let whereClause = '';
    let params = [ticketId];
    if (role === 'citizen') {
        whereClause = 'WHERE id = $1 AND created_by = $2';
        params.push(userID);
    }
    else if (role === 'staff') {
        whereClause = 'WHERE id = $1 AND assigned_to = $2';
        params.push(userID);
    }
    else if (role === 'supervisor') {
        whereClause = 'WHERE id = $1 AND (current_supervisor = $2 OR assigned_to = $2)';
        params.push(userID);
    }
    else {
        whereClause = 'WHERE id = $1';
    }
    const result = await (0, database_1.query)(`SELECT * FROM tickets ${whereClause}`, params);
    if (result.rows.length === 0) {
        throw new Error('Ticket not found or access denied');
    }
    return result.rows[0];
}
async function createTicket(input, auth) {
    if (auth.role !== 'citizen') {
        throw new Error('Only citizens can create tickets');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        const ticketId = (0, uuid_1.v4)();
        await txQuery(`INSERT INTO tickets (id, created_by, category, title, description, address_text, lat, lng, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'new')`, [ticketId, auth.userID, input.category, input.title, input.description, input.address_text, input.lat, input.lng]);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, to_status) 
       VALUES ($1, $2, 'created', 'new')`, [ticketId, auth.userID]);
        if (input.attachmentUrls?.length) {
            for (const url of input.attachmentUrls) {
                await txQuery(`INSERT INTO ticket_attachments (ticket_id, uploaded_by, kind, url) 
           VALUES ($1, $2, 'photo', $3)`, [ticketId, auth.userID, url]);
            }
        }
        return { ticketId };
    });
}
async function assignTicket(input, auth) {
    if (!['supervisor', 'admin'].includes(auth.role)) {
        throw new Error('Only supervisors and admins can assign tickets');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        const ticket = await checkTicketAccess(input.ticketId, auth.userID, auth.role);
        await txQuery(`UPDATE tickets SET assigned_to = $1, status = 'assigned', updated_at = NOW() 
       WHERE id = $2`, [input.staffId, input.ticketId]);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, from_status, to_status) 
       VALUES ($1, $2, 'assigned', $3, 'assigned')`, [input.ticketId, auth.userID, ticket.status]);
        return { success: true };
    });
}
async function startWork(input, auth) {
    if (auth.role !== 'staff') {
        throw new Error('Only staff can start work on tickets');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        const ticket = await checkTicketAccess(input.ticketId, auth.userID, auth.role);
        await txQuery(`UPDATE tickets SET status = 'in_progress', updated_at = NOW() 
       WHERE id = $1`, [input.ticketId]);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, from_status, to_status, message) 
       VALUES ($1, $2, 'status_changed', $3, 'in_progress', $4)`, [input.ticketId, auth.userID, ticket.status, input.message]);
        return { success: true };
    });
}
async function addStaffUpdate(input, auth) {
    if (auth.role !== 'staff') {
        throw new Error('Only staff can add updates');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        await checkTicketAccess(input.ticketId, auth.userID, auth.role);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, message) 
       VALUES ($1, $2, 'comment', $3)`, [input.ticketId, auth.userID, input.message]);
        if (input.attachmentUrls?.length) {
            for (const url of input.attachmentUrls) {
                await txQuery(`INSERT INTO ticket_attachments (ticket_id, uploaded_by, kind, url) 
           VALUES ($1, $2, 'photo', $3)`, [input.ticketId, auth.userID, url]);
            }
        }
        return { success: true };
    });
}
async function escalateToSupervisor(input, auth) {
    if (auth.role !== 'staff') {
        throw new Error('Only staff can escalate tickets');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        const ticket = await checkTicketAccess(input.ticketId, auth.userID, auth.role);
        await txQuery(`UPDATE tickets SET current_supervisor = $1, status = 'waiting_supervisor', updated_at = NOW() 
       WHERE id = $2`, [input.supervisorId, input.ticketId]);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, from_status, to_status, message) 
       VALUES ($1, $2, 'escalated', $3, 'waiting_supervisor', $4)`, [input.ticketId, auth.userID, ticket.status, input.message]);
        return { success: true };
    });
}
async function markResolved(input, auth) {
    if (!['staff', 'supervisor'].includes(auth.role)) {
        throw new Error('Only staff and supervisors can mark tickets as resolved');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        const ticket = await checkTicketAccess(input.ticketId, auth.userID, auth.role);
        await txQuery(`UPDATE tickets SET status = 'resolved', updated_at = NOW() 
       WHERE id = $1`, [input.ticketId]);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, from_status, to_status, message) 
       VALUES ($1, $2, 'resolved', $3, 'resolved', $4)`, [input.ticketId, auth.userID, ticket.status, input.message]);
        if (input.attachmentUrls?.length) {
            for (const url of input.attachmentUrls) {
                await txQuery(`INSERT INTO ticket_attachments (ticket_id, uploaded_by, kind, url) 
           VALUES ($1, $2, 'photo', $3)`, [input.ticketId, auth.userID, url]);
            }
        }
        return { success: true };
    });
}
async function citizenCloseTicket(input, auth) {
    if (auth.role !== 'citizen') {
        throw new Error('Only citizens can close their own tickets');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        const ticket = await checkTicketAccess(input.ticketId, auth.userID, auth.role);
        await txQuery(`UPDATE tickets SET status = 'closed', closed_at = NOW(), citizen_rating = $1, citizen_feedback = $2, updated_at = NOW() 
       WHERE id = $3`, [input.rating, input.feedback, input.ticketId]);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, from_status, to_status) 
       VALUES ($1, $2, 'closed', $3, 'closed')`, [input.ticketId, auth.userID, ticket.status]);
        return { success: true };
    });
}
async function reopenTicket(input, auth) {
    if (auth.role !== 'citizen') {
        throw new Error('Only citizens can reopen their own tickets');
    }
    return await (0, database_1.transaction)(async (txQuery) => {
        const ticket = await checkTicketAccess(input.ticketId, auth.userID, auth.role);
        if (ticket.status !== 'closed') {
            throw new Error('Only closed tickets can be reopened');
        }
        await txQuery(`UPDATE tickets SET status = 'reopened', updated_at = NOW() 
       WHERE id = $1`, [input.ticketId]);
        await txQuery(`INSERT INTO ticket_events (ticket_id, actor_id, type, from_status, to_status, message) 
       VALUES ($1, $2, 'reopened', 'closed', 'reopened', $3)`, [input.ticketId, auth.userID, input.reason]);
        return { success: true };
    });
}
//# sourceMappingURL=mutators.js.map