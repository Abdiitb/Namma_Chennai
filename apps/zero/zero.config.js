const { schema, permissions } = require('../api/dist/schema');

module.exports = {
  schema,
  permissions,
  upstream: {
    db: process.env.ZERO_UPSTREAM_DB || 'postgresql://postgres:password@localhost:5432/citizen_services',
  },
  server: {
    port: parseInt(process.env.ZERO_CACHE_PORT) || 4848,
    cors: {
      origin: ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:3000'],
      credentials: true,
    },
  },
  auth: {
    secret: process.env.ZERO_AUTH_SECRET || 'your-auth-secret-key-here',
    allowAnonymous: true,
  },
  // Query URL - tells zero-cache where to resolve queries
  queryURL: 'http://localhost:3000/api/zero/query',
  replication: {
    logLevel: 'info',
  },
};