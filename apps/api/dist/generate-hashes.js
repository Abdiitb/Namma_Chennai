"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
async function generateHashes() {
    const passwords = ['admin123', 'super123', 'staff123', 'citizen123'];
    for (const password of passwords) {
        const hash = await bcrypt_1.default.hash(password, 10);
        console.log(`${password}: ${hash}`);
    }
}
generateHashes();
//# sourceMappingURL=generate-hashes.js.map