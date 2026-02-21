export const openApiSpec = {
    openapi: "3.0.0",
    info: {
        title: "Project Turtle API",
        version: "1.0.0",
        description: "API for Project Turtle Backend powered by Cloudflare D1",
    },
    servers: [
        {
            url: "http://localhost:8787",
            description: "Local Dev Server",
        },
    ],
    paths: {
        "/users": {
            post: {
                summary: "Create a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    email: { type: "string" },
                                    name: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "User created" }
                }
            }
        },
        "/users/{id}": {
            get: {
                summary: "Get user by ID",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "User found" },
                    "404": { description: "User not found" }
                }
            }
        },
        "/goals": {
            post: {
                summary: "Create a new goal",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    targetHours: { type: "number" },
                                    period: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Goal created" } }
            },
            get: {
                summary: "Get all goals",
                responses: { "200": { description: "List of goals" } }
            }
        },
        "/goals/{goalId}/logs": {
            post: {
                summary: "Add a progress log to a specific goal",
                parameters: [
                    { name: "goalId", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    hours: { type: "number" },
                                    timestamp: { type: "string", format: "date-time" },
                                    isCompleted: { type: "boolean" }
                                }
                            }
                        }
                    }
                },
                responses: { "201": { description: "Log added" } }
            },
            get: {
                summary: "Get logs for a specific goal",
                parameters: [
                    { name: "goalId", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { "200": { description: "List of logs" } }
            }
        },
        "/tasks": {
            post: {
                summary: "Create a new task",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    startTime: { type: "string", format: "date-time" },
                                    endTime: { type: "string", format: "date-time" },
                                    status: { type: "string" },
                                    recurrence: { type: "string" },
                                    userId: { type: "string" },
                                    goalId: { type: "string" },
                                    goalLogId: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Task created" } }
            },
            get: {
                summary: "Get tasks",
                parameters: [
                    { name: "userId", in: "query", schema: { type: "string" }, description: "Filter by User ID" }
                ],
                responses: { "200": { description: "List of tasks" } }
            }
        },
        "/tasks/{id}/status": {
            put: {
                summary: "Update task status",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { status: { type: "string" } }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Task status updated" } }
            }
        },
        "/notes": {
            post: {
                summary: "Create a new note",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    content: { type: "string" },
                                    userId: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Note created" } }
            },
            get: {
                summary: "Get notes",
                parameters: [
                    { name: "userId", in: "query", schema: { type: "string" }, description: "Filter by User ID" }
                ],
                responses: { "200": { description: "List of notes" } }
            }
        },
        "/transactions": {
            post: {
                summary: "Create a new transaction",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    amount: { type: "number" },
                                    type: { type: "string" },
                                    date: { type: "string", format: "date-time" },
                                    category: { type: "string" },
                                    userId: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Transaction created" } }
            },
            get: {
                summary: "Get transactions",
                parameters: [
                    { name: "userId", in: "query", schema: { type: "string" }, description: "Filter by User ID" }
                ],
                responses: { "200": { description: "List of transactions" } }
            }
        }
    }
};
