"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.ticket_attachments = exports.ticket_events = exports.tickets = exports.staff_profiles = exports.users = void 0;
const zero_1 = require("@rocicorp/zero");
exports.users = (0, zero_1.createTableSchema)({
    tableName: 'users',
    columns: {
        id: { type: 'string' },
        role: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string', optional: true },
        email: { type: 'string', optional: true },
        password_hash: { type: 'string' },
        created_at: { type: 'string' },
    },
    primaryKey: 'id',
});
exports.staff_profiles = (0, zero_1.createTableSchema)({
    tableName: 'staff_profiles',
    columns: {
        user_id: { type: 'string' },
        department: { type: 'string', optional: true },
        ward: { type: 'string', optional: true },
        reports_to: { type: 'string', optional: true },
    },
    primaryKey: 'user_id',
});
exports.tickets = (0, zero_1.createTableSchema)({
    tableName: 'tickets',
    columns: {
        id: { type: 'string' },
        created_by: { type: 'string' },
        category: { type: 'string' },
        title: { type: 'string', optional: true },
        description: { type: 'string' },
        address_text: { type: 'string', optional: true },
        lat: { type: 'number', optional: true },
        lng: { type: 'number', optional: true },
        status: { type: 'string' },
        assigned_to: { type: 'string', optional: true },
        current_supervisor: { type: 'string', optional: true },
        citizen_rating: { type: 'number', optional: true },
        citizen_feedback: { type: 'string', optional: true },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        closed_at: { type: 'string', optional: true },
    },
    primaryKey: 'id',
});
exports.ticket_events = (0, zero_1.createTableSchema)({
    tableName: 'ticket_events',
    columns: {
        id: { type: 'string' },
        ticket_id: { type: 'string' },
        actor_id: { type: 'string' },
        type: { type: 'string' },
        from_status: { type: 'string', optional: true },
        to_status: { type: 'string', optional: true },
        message: { type: 'string', optional: true },
        created_at: { type: 'string' },
    },
    primaryKey: 'id',
});
exports.ticket_attachments = (0, zero_1.createTableSchema)({
    tableName: 'ticket_attachments',
    columns: {
        id: { type: 'string' },
        ticket_id: { type: 'string' },
        uploaded_by: { type: 'string' },
        kind: { type: 'string' },
        url: { type: 'string' },
        mime_type: { type: 'string', optional: true },
        caption: { type: 'string', optional: true },
        created_at: { type: 'string' },
    },
    primaryKey: 'id',
});
exports.schema = (0, zero_1.createSchema)({
    version: 1,
    tables: {
        users: exports.users,
        staff_profiles: exports.staff_profiles,
        tickets: exports.tickets,
        ticket_events: exports.ticket_events,
        ticket_attachments: exports.ticket_attachments,
    },
});
//# sourceMappingURL=schema.js.map