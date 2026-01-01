export declare const users: import("@rocicorp/zero").TableBuilderWithColumns<{
    name: "users";
    columns: {
        readonly id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly role: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly name: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly phone: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly email: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly password_hash: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly created_at: {
            type: "string";
            optional: false;
            customType: string;
        };
    };
    primaryKey: readonly [string, ...string[]];
} & {
    primaryKey: ["id"];
}>;
export declare const staff_profiles: import("@rocicorp/zero").TableBuilderWithColumns<{
    name: "staff_profiles";
    columns: {
        readonly user_id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly department: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly ward: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly reports_to: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
    };
    primaryKey: readonly [string, ...string[]];
} & {
    primaryKey: ["user_id"];
}>;
export declare const tickets: import("@rocicorp/zero").TableBuilderWithColumns<{
    name: "tickets";
    columns: {
        readonly id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly created_by: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly category: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly title: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly description: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly address_text: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly lat: Omit<{
            type: "number";
            optional: false;
            customType: number;
        }, "optional"> & {
            optional: true;
        };
        readonly lng: Omit<{
            type: "number";
            optional: false;
            customType: number;
        }, "optional"> & {
            optional: true;
        };
        readonly status: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly assigned_to: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly current_supervisor: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly citizen_rating: Omit<{
            type: "number";
            optional: false;
            customType: number;
        }, "optional"> & {
            optional: true;
        };
        readonly citizen_feedback: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly created_at: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly updated_at: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly closed_at: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
    };
    primaryKey: readonly [string, ...string[]];
} & {
    primaryKey: ["id"];
}>;
export declare const ticket_events: import("@rocicorp/zero").TableBuilderWithColumns<{
    name: "ticket_events";
    columns: {
        readonly id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly ticket_id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly actor_id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly type: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly from_status: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly to_status: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly message: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly created_at: {
            type: "string";
            optional: false;
            customType: string;
        };
    };
    primaryKey: readonly [string, ...string[]];
} & {
    primaryKey: ["id"];
}>;
export declare const ticket_attachments: import("@rocicorp/zero").TableBuilderWithColumns<{
    name: "ticket_attachments";
    columns: {
        readonly id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly ticket_id: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly uploaded_by: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly kind: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly url: {
            type: "string";
            optional: false;
            customType: string;
        };
        readonly mime_type: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly caption: Omit<{
            type: "string";
            optional: false;
            customType: string;
        }, "optional"> & {
            optional: true;
        };
        readonly created_at: {
            type: "string";
            optional: false;
            customType: string;
        };
    };
    primaryKey: readonly [string, ...string[]];
} & {
    primaryKey: ["id"];
}>;
export declare const schema: {
    tables: {
        readonly users: {
            name: "users";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly role: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly name: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly phone: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly email: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly password_hash: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
        readonly staff_profiles: {
            name: "staff_profiles";
            columns: {
                readonly user_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly department: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly ward: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly reports_to: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["user_id"];
        };
        readonly tickets: {
            name: "tickets";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly created_by: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly category: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly title: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly description: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly address_text: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly lat: Omit<{
                    type: "number";
                    optional: false;
                    customType: number;
                }, "optional"> & {
                    optional: true;
                };
                readonly lng: Omit<{
                    type: "number";
                    optional: false;
                    customType: number;
                }, "optional"> & {
                    optional: true;
                };
                readonly status: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly assigned_to: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly current_supervisor: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly citizen_rating: Omit<{
                    type: "number";
                    optional: false;
                    customType: number;
                }, "optional"> & {
                    optional: true;
                };
                readonly citizen_feedback: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly updated_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly closed_at: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
        readonly ticket_events: {
            name: "ticket_events";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly ticket_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly actor_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly type: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly from_status: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly to_status: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly message: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
        readonly ticket_attachments: {
            name: "ticket_attachments";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly ticket_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly uploaded_by: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly kind: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly url: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly mime_type: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly caption: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
    };
    relationships: {
        readonly [x: string]: Record<string, import("@rocicorp/zero/out/zero-types/src/schema").Relationship>;
    };
    enableLegacyQueries: boolean | undefined;
    enableLegacyMutators: boolean | undefined;
};
export declare const zql: import("@rocicorp/zero").SchemaQuery<{
    tables: {
        readonly users: {
            name: "users";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly role: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly name: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly phone: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly email: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly password_hash: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
        readonly staff_profiles: {
            name: "staff_profiles";
            columns: {
                readonly user_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly department: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly ward: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly reports_to: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["user_id"];
        };
        readonly tickets: {
            name: "tickets";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly created_by: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly category: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly title: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly description: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly address_text: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly lat: Omit<{
                    type: "number";
                    optional: false;
                    customType: number;
                }, "optional"> & {
                    optional: true;
                };
                readonly lng: Omit<{
                    type: "number";
                    optional: false;
                    customType: number;
                }, "optional"> & {
                    optional: true;
                };
                readonly status: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly assigned_to: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly current_supervisor: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly citizen_rating: Omit<{
                    type: "number";
                    optional: false;
                    customType: number;
                }, "optional"> & {
                    optional: true;
                };
                readonly citizen_feedback: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly updated_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly closed_at: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
        readonly ticket_events: {
            name: "ticket_events";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly ticket_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly actor_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly type: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly from_status: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly to_status: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly message: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
        readonly ticket_attachments: {
            name: "ticket_attachments";
            columns: {
                readonly id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly ticket_id: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly uploaded_by: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly kind: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly url: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
                readonly mime_type: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly caption: Omit<{
                    type: "string";
                    optional: false;
                    customType: string;
                }, "optional"> & {
                    optional: true;
                };
                readonly created_at: {
                    type: "string";
                    optional: false;
                    customType: string;
                };
            };
            primaryKey: readonly [string, ...string[]];
        } & {
            primaryKey: ["id"];
        };
    };
    relationships: {
        readonly [x: string]: Record<string, import("@rocicorp/zero/out/zero-types/src/schema").Relationship>;
    };
    enableLegacyQueries: boolean | undefined;
    enableLegacyMutators: boolean | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map