export declare const users: {
    readonly tableName: "users";
    readonly columns: {
        readonly id: {
            readonly type: "string";
        };
        readonly role: {
            readonly type: "string";
        };
        readonly name: {
            readonly type: "string";
        };
        readonly phone: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly email: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly password_hash: {
            readonly type: "string";
        };
        readonly created_at: {
            readonly type: "string";
        };
    };
    readonly primaryKey: "id";
};
export declare const staff_profiles: {
    readonly tableName: "staff_profiles";
    readonly columns: {
        readonly user_id: {
            readonly type: "string";
        };
        readonly department: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly ward: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly reports_to: {
            readonly type: "string";
            readonly optional: true;
        };
    };
    readonly primaryKey: "user_id";
};
export declare const tickets: {
    readonly tableName: "tickets";
    readonly columns: {
        readonly id: {
            readonly type: "string";
        };
        readonly created_by: {
            readonly type: "string";
        };
        readonly category: {
            readonly type: "string";
        };
        readonly title: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly description: {
            readonly type: "string";
        };
        readonly address_text: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly lat: {
            readonly type: "number";
            readonly optional: true;
        };
        readonly lng: {
            readonly type: "number";
            readonly optional: true;
        };
        readonly status: {
            readonly type: "string";
        };
        readonly assigned_to: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly current_supervisor: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly citizen_rating: {
            readonly type: "number";
            readonly optional: true;
        };
        readonly citizen_feedback: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly created_at: {
            readonly type: "string";
        };
        readonly updated_at: {
            readonly type: "string";
        };
        readonly closed_at: {
            readonly type: "string";
            readonly optional: true;
        };
    };
    readonly primaryKey: "id";
};
export declare const ticket_events: {
    readonly tableName: "ticket_events";
    readonly columns: {
        readonly id: {
            readonly type: "string";
        };
        readonly ticket_id: {
            readonly type: "string";
        };
        readonly actor_id: {
            readonly type: "string";
        };
        readonly type: {
            readonly type: "string";
        };
        readonly from_status: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly to_status: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly message: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly created_at: {
            readonly type: "string";
        };
    };
    readonly primaryKey: "id";
};
export declare const ticket_attachments: {
    readonly tableName: "ticket_attachments";
    readonly columns: {
        readonly id: {
            readonly type: "string";
        };
        readonly ticket_id: {
            readonly type: "string";
        };
        readonly uploaded_by: {
            readonly type: "string";
        };
        readonly kind: {
            readonly type: "string";
        };
        readonly url: {
            readonly type: "string";
        };
        readonly mime_type: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly caption: {
            readonly type: "string";
            readonly optional: true;
        };
        readonly created_at: {
            readonly type: "string";
        };
    };
    readonly primaryKey: "id";
};
export declare const schema: {
    readonly version: 1;
    readonly tables: {
        readonly users: {
            readonly tableName: "users";
            readonly columns: {
                readonly id: {
                    readonly type: "string";
                };
                readonly role: {
                    readonly type: "string";
                };
                readonly name: {
                    readonly type: "string";
                };
                readonly phone: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly email: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly password_hash: {
                    readonly type: "string";
                };
                readonly created_at: {
                    readonly type: "string";
                };
            };
            readonly primaryKey: "id";
        };
        readonly staff_profiles: {
            readonly tableName: "staff_profiles";
            readonly columns: {
                readonly user_id: {
                    readonly type: "string";
                };
                readonly department: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly ward: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly reports_to: {
                    readonly type: "string";
                    readonly optional: true;
                };
            };
            readonly primaryKey: "user_id";
        };
        readonly tickets: {
            readonly tableName: "tickets";
            readonly columns: {
                readonly id: {
                    readonly type: "string";
                };
                readonly created_by: {
                    readonly type: "string";
                };
                readonly category: {
                    readonly type: "string";
                };
                readonly title: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly description: {
                    readonly type: "string";
                };
                readonly address_text: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly lat: {
                    readonly type: "number";
                    readonly optional: true;
                };
                readonly lng: {
                    readonly type: "number";
                    readonly optional: true;
                };
                readonly status: {
                    readonly type: "string";
                };
                readonly assigned_to: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly current_supervisor: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly citizen_rating: {
                    readonly type: "number";
                    readonly optional: true;
                };
                readonly citizen_feedback: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly created_at: {
                    readonly type: "string";
                };
                readonly updated_at: {
                    readonly type: "string";
                };
                readonly closed_at: {
                    readonly type: "string";
                    readonly optional: true;
                };
            };
            readonly primaryKey: "id";
        };
        readonly ticket_events: {
            readonly tableName: "ticket_events";
            readonly columns: {
                readonly id: {
                    readonly type: "string";
                };
                readonly ticket_id: {
                    readonly type: "string";
                };
                readonly actor_id: {
                    readonly type: "string";
                };
                readonly type: {
                    readonly type: "string";
                };
                readonly from_status: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly to_status: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly message: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly created_at: {
                    readonly type: "string";
                };
            };
            readonly primaryKey: "id";
        };
        readonly ticket_attachments: {
            readonly tableName: "ticket_attachments";
            readonly columns: {
                readonly id: {
                    readonly type: "string";
                };
                readonly ticket_id: {
                    readonly type: "string";
                };
                readonly uploaded_by: {
                    readonly type: "string";
                };
                readonly kind: {
                    readonly type: "string";
                };
                readonly url: {
                    readonly type: "string";
                };
                readonly mime_type: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly caption: {
                    readonly type: "string";
                    readonly optional: true;
                };
                readonly created_at: {
                    readonly type: "string";
                };
            };
            readonly primaryKey: "id";
        };
    };
};
//# sourceMappingURL=schema.d.ts.map