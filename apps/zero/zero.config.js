const { schema } = require('@citizen-services/shared');

module.exports = {
  schema,
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
    endpoint: 'http://localhost:3000/api/zero',
  },
  replication: {
    logLevel: 'info',
  },
};