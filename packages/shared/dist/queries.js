"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZERO_QUERIES = void 0;
const zero_1 = require("@rocicorp/zero");
const zod_1 = require("zod");
const schema_1 = require("./schema");
exports.ZERO_QUERIES = (0, zero_1.defineQueries)({
    myTickets: (0, zero_1.defineQuery)(zod_1.z.object({
        userID: zod_1.z.string(),
    }), ({ args: { userID } }) => schema_1.zql.tickets
        .where('created_by', userID)
        .orderBy('created_at', 'desc')),
    assignedTickets: (0, zero_1.defineQuery)(zod_1.z.object({
        userID: zod_1.z.string(),
    }), ({ args: { userID } }) => schema_1.zql.tickets
        .where('assigned_to', userID)
        .orderBy('updated_at', 'desc')),
    supervisorQueue: (0, zero_1.defineQuery)(zod_1.z.object({
        userID: zod_1.z.string(),
    }), ({ args: { userID } }) => schema_1.zql.tickets
        .where('current_supervisor', userID)
        .where('status', 'waiting_supervisor')
        .orderBy('updated_at', 'asc')),
    ticketDetail: (0, zero_1.defineQuery)(zod_1.z.object({
        ticketId: zod_1.z.string(),
    }), ({ args: { ticketId } }) => schema_1.zql.tickets.where('id', ticketId)),
});
//# sourceMappingURL=queries.js.map