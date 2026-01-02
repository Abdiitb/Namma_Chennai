const permissions = {
  users: {
    read: () => true,
  },

  staff_profiles: {
    read: () => true,
  },

  tickets: {
    read: () => true,
  },

  ticket_events: {
    read: () => true,
  },

  ticket_attachments: {
    read: () => true,
  },
};

export default permissions;
