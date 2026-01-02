"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./auth");
const zero_queries_1 = require("./zero-queries");
const server_1 = require("@rocicorp/zero/server");
const schema_1 = require("./schema");
const queries_1 = require("./queries");
const mutators_1 = require("./mutators");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
// Auth endpoint
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const result = await (0, auth_1.loginUser)(email, password);
        res.json(result);
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});
// NEW: Registration endpoint
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Validate password length
        // if (password.length < 6) {
        //   return res.status(400).json({ error: 'Password must be at least 6 characters' });
        // }
        // Default role to 'citizen' if not provided
        const userRole = role || 'citizen';
        // Validate role
        if (!['citizen', 'staff', 'supervisor', 'admin'].includes(userRole)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const result = await (0, auth_1.registerUser)(email, password, name, userRole);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Registration error:', error);
        const message = error.message;
        if (message.includes('already exists')) {
            res.status(409).json({ error: message });
        }
        else {
            res.status(500).json({ error: message || 'Registration failed' });
        }
    }
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Zero query endpoint - This is what zero-cache calls to get ZQL for each query
app.post('/api/zero/query', async (req, res) => {
    try {
        const result = await (0, server_1.handleQueryRequest)((name, args) => {
            const query = (0, server_1.mustGetQuery)(zero_queries_1.ZERO_QUERIES, name);
            // For anonymous/development access, use 'anon' as userID
            return query.fn({ args, ctx: { userID: 'anon' } });
        }, schema_1.schema, req);
        res.json(result);
    }
    catch (error) {
        console.error('Zero query error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Zero queries endpoint (legacy)
app.post('/api/zero/queries', auth_1.authMiddleware, async (req, res) => {
    try {
        const { queryName, args } = req.body;
        const auth = req.auth;
        console.log(`Processing query: ${queryName} for user: ${auth.userID} (${auth.role})`);
        let result;
        switch (queryName) {
            case 'myTickets':
                result = await (0, queries_1.getMyTickets)(auth);
                break;
            case 'assignedTickets':
                result = await (0, queries_1.getAssignedTickets)(auth);
                break;
            case 'supervisorQueue':
                result = await (0, queries_1.getSupervisorQueue)(auth);
                break;
            case 'ticketDetail':
                if (!args?.ticketId) {
                    return res.status(400).json({ error: 'ticketId is required' });
                }
                result = await (0, queries_1.getTicketDetail)(args.ticketId, auth);
                break;
            default:
                return res.status(400).json({ error: `Unknown query: ${queryName}` });
        }
        res.json({ data: result });
    }
    catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Zero mutate endpoint
app.post('/api/zero/mutate', auth_1.authMiddleware, async (req, res) => {
    try {
        const { mutatorName, input } = req.body;
        const auth = req.auth;
        console.log(`Processing mutator: ${mutatorName} for user: ${auth.userID} (${auth.role})`);
        let result;
        switch (mutatorName) {
            case 'createTicket':
                result = await (0, mutators_1.createTicket)(input, auth);
                break;
            case 'assignTicket':
                result = await (0, mutators_1.assignTicket)(input, auth);
                break;
            case 'startWork':
                result = await (0, mutators_1.startWork)(input, auth);
                break;
            case 'addStaffUpdate':
                result = await (0, mutators_1.addStaffUpdate)(input, auth);
                break;
            case 'escalateToSupervisor':
                result = await (0, mutators_1.escalateToSupervisor)(input, auth);
                break;
            case 'markResolved':
                result = await (0, mutators_1.markResolved)(input, auth);
                break;
            case 'citizenCloseTicket':
                result = await (0, mutators_1.citizenCloseTicket)(input, auth);
                break;
            case 'reopenTicket':
                result = await (0, mutators_1.reopenTicket)(input, auth);
                break;
            default:
                return res.status(400).json({ error: `Unknown mutator: ${mutatorName}` });
        }
        res.json({ data: result });
    }
    catch (error) {
        console.error('Mutator error:', error);
        res.status(500).json({ error: error.message });
    }
});
// For debugging: list all available queries
app.get('/api/zero/available-queries', (req, res) => {
    res.json({
        queries: Object.keys(zero_queries_1.ZERO_QUERIES),
        mutators: [
            'createTicket',
            'assignTicket',
            'startWork',
            'addStaffUpdate',
            'escalateToSupervisor',
            'markResolved',
            'citizenCloseTicket',
            'reopenTicket'
        ]
    });
});
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map