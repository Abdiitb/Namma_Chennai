"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zql = exports.schema = exports.ticket_attachments = exports.ticket_events = exports.tickets = exports.staff_profiles = exports.users = void 0;
const zero_1 = require("@rocicorp/zero");
exports.users = (0, zero_1.table)('users')
    .columns({
    id: (0, zero_1.string)(),
    role: (0, zero_1.string)(),
    name: (0, zero_1.string)(),
    phone: (0, zero_1.string)().optional(),
    email: (0, zero_1.string)().optional(),
    password_hash: (0, zero_1.string)(),
    created_at: (0, zero_1.string)(),
})
    .primaryKey('id');
exports.staff_profiles = (0, zero_1.table)('staff_profiles')
    .columns({
    user_id: (0, zero_1.string)(),
    department: (0, zero_1.string)().optional(),
    ward: (0, zero_1.string)().optional(),
    reports_to: (0, zero_1.string)().optional(),
})
    .primaryKey('user_id');
exports.tickets = (0, zero_1.table)('tickets')
    .columns({
    id: (0, zero_1.string)(),
    created_by: (0, zero_1.string)(),
    category: (0, zero_1.string)(),
    title: (0, zero_1.string)().optional(),
    description: (0, zero_1.string)(),
    address_text: (0, zero_1.string)().optional(),
    lat: (0, zero_1.number)().optional(),
    lng: (0, zero_1.number)().optional(),
    status: (0, zero_1.string)(),
    assigned_to: (0, zero_1.string)().optional(),
    current_supervisor: (0, zero_1.string)().optional(),
    citizen_rating: (0, zero_1.number)().optional(),
    citizen_feedback: (0, zero_1.string)().optional(),
    created_at: (0, zero_1.string)(),
    updated_at: (0, zero_1.string)(),
    closed_at: (0, zero_1.string)().optional(),
})
    .primaryKey('id');
exports.ticket_events = (0, zero_1.table)('ticket_events')
    .columns({
    id: (0, zero_1.string)(),
    ticket_id: (0, zero_1.string)(),
    actor_id: (0, zero_1.string)(),
    type: (0, zero_1.string)(),
    from_status: (0, zero_1.string)().optional(),
    to_status: (0, zero_1.string)().optional(),
    message: (0, zero_1.string)().optional(),
    created_at: (0, zero_1.string)(),
})
    .primaryKey('id');
exports.ticket_attachments = (0, zero_1.table)('ticket_attachments')
    .columns({
    id: (0, zero_1.string)(),
    ticket_id: (0, zero_1.string)(),
    uploaded_by: (0, zero_1.string)(),
    kind: (0, zero_1.string)(),
    url: (0, zero_1.string)(),
    mime_type: (0, zero_1.string)().optional(),
    caption: (0, zero_1.string)().optional(),
    created_at: (0, zero_1.string)(),
})
    .primaryKey('id');
exports.schema = (0, zero_1.createSchema)({
    tables: [
        exports.users,
        exports.staff_profiles,
        exports.tickets,
        exports.ticket_events,
        exports.ticket_attachments,
    ],
});
exports.zql = (0, zero_1.createBuilder)(exports.schema);
//# sourceMappingURL=schema.js.map