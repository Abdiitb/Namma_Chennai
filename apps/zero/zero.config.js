const { schema } = require('../api/dist/schema');

module.exports = {
  schema,
  upstream: {
    db: process.env.ZERO_UPSTREAM_DB || 'postgresql://postgres:password@localhost:5432/citizen_services',
  },
  server: {
    port: parseInt(process.env.ZERO_CACHE_PORT) || 4848,
    cors: {
      origin: ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:3000', 'http://192.168.1.102:8081', 'http://192.168.1.102:19006', 'http://192.168.1.102:3000'],
      credentials: true,
    },
  },
  replication: {
    logLevel: 'info',
  },
  // Set mutate and query URLs to bypass authentication
  mutateUrl: 'http://localhost:3000/api/*',
  queryUrl: 'http://localhost:3000/api/*',
};