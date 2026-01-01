export declare const ZERO_QUERIES: import("@rocicorp/zero").QueryRegistry<{
    readonly myTickets: import("@rocicorp/zero").QueryDefinition<"tickets", {
        userID: string;
    }, {
        userID: string;
    }, {
        readonly id: string;
        readonly created_by: string;
        readonly category: string;
        readonly title: string | null;
        readonly description: string;
        readonly address_text: string | null;
        readonly lat: number | null;
        readonly lng: number | null;
        readonly status: string;
        readonly assigned_to: string | null;
        readonly current_supervisor: string | null;
        readonly citizen_rating: number | null;
        readonly citizen_feedback: string | null;
        readonly created_at: string;
        readonly updated_at: string;
        readonly closed_at: string | null;
    }, unknown>;
    readonly assignedTickets: import("@rocicorp/zero").QueryDefinition<"tickets", {
        userID: string;
    }, {
        userID: string;
    }, {
        readonly id: string;
        readonly created_by: string;
        readonly category: string;
        readonly title: string | null;
        readonly description: string;
        readonly address_text: string | null;
        readonly lat: number | null;
        readonly lng: number | null;
        readonly status: string;
        readonly assigned_to: string | null;
        readonly current_supervisor: string | null;
        readonly citizen_rating: number | null;
        readonly citizen_feedback: string | null;
        readonly created_at: string;
        readonly updated_at: string;
        readonly closed_at: string | null;
    }, unknown>;
    readonly supervisorQueue: import("@rocicorp/zero").QueryDefinition<"tickets", {
        userID: string;
    }, {
        userID: string;
    }, {
        readonly id: string;
        readonly created_by: string;
        readonly category: string;
        readonly title: string | null;
        readonly description: string;
        readonly address_text: string | null;
        readonly lat: number | null;
        readonly lng: number | null;
        readonly status: string;
        readonly assigned_to: string | null;
        readonly current_supervisor: string | null;
        readonly citizen_rating: number | null;
        readonly citizen_feedback: string | null;
        readonly created_at: string;
        readonly updated_at: string;
        readonly closed_at: string | null;
    }, unknown>;
    readonly ticketDetail: import("@rocicorp/zero").QueryDefinition<"tickets", {
        ticketId: string;
    }, {
        ticketId: string;
    }, {
        readonly id: string;
        readonly created_by: string;
        readonly category: string;
        readonly title: string | null;
        readonly description: string;
        readonly address_text: string | null;
        readonly lat: number | null;
        readonly lng: number | null;
        readonly status: string;
        readonly assigned_to: string | null;
        readonly current_supervisor: string | null;
        readonly citizen_rating: number | null;
        readonly citizen_feedback: string | null;
        readonly created_at: string;
        readonly updated_at: string;
        readonly closed_at: string | null;
    }, unknown>;
}, import("@rocicorp/zero").Schema>;
//# sourceMappingURL=queries.d.ts.map