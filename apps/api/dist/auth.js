"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.authMiddleware = authMiddleware;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("./database");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-prototype';
function generateToken(userID, role) {
    return jsonwebtoken_1.default.sign({ userID, role }, JWT_SECRET, { expiresIn: '24h' });
}
function verifyToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    return {
        userID: decoded.userID,
        role: decoded.role,
    };
}
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 10);
}
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    const token = authHeader.substring(7);
    try {
        const auth = verifyToken(token);
        req.auth = auth;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
async function loginUser(email, password) {
    const result = await (0, database_1.query)('SELECT id, role, name, password_hash FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    const user = result.rows[0];
    const passwordValid = await comparePassword(password, user.password_hash);
    if (!passwordValid) {
        throw new Error('Invalid password');
    }
    const token = generateToken(user.id, user.role);
    return {
        token,
        user: {
            id: user.id,
            role: user.role,
            name: user.name,
        },
    };
}
async function registerUser(email, password, name, role = 'citizen') {
    // Check if user already exists
    const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new Error('User already exists with this email');
    }
    // Hash password
    const passwordHash = await hashPassword(password);
    const userId = require('uuid').v4();
    // Insert new user
    const result = await (0, database_1.query)('INSERT INTO users (id, email, name, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, email, name, role', [userId, email, name, passwordHash, role]);
    const user = result.rows[0];
    const token = generateToken(user.id, user.role);
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    };
}
//# sourceMappingURL=auth.js.map