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
        {
            url: "https://weekly_backend.seyitfatihyazici11.workers.dev",
            description: "Production Server",
        }
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "API Key",
                description: "Enter your API Key as a Bearer token"
            }
        }
    },
    security: [
        {
            ApiKeyAuth: []
        }
    ],
    tags: [
        { name: "Auth", description: "Authentication and JWT issuance" },
        { name: "Users", description: "User management endpoints" },
        { name: "Goals", description: "Long-term goals and their progress logs" },
        { name: "Tasks", description: "Daily/Weekly tasks management" },
        { name: "Notes", description: "User notebook and ideas" },
        { name: "Finance", description: "Income and expense tracking" }
    ],
    paths: {
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string" },
                                    name: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "201": { description: "User registered" } }
            }
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login and receive tokens",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Tokens generated" } }
            }
        },
        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh Access Token",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "New Access Token and Refresh Token generated" } }
            }
        },
        "/users": {
            post: {
                tags: ["Users"],
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
            },
            get: {
                tags: ["Users"],
                summary: "Get all users (Requires expansion)",
                responses: { "200": { description: "List of users" } }
            }
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Get user by ID",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "User found" },
                    "404": { description: "User not found" }
                }
            },
            delete: {
                tags: ["Users"],
                summary: "Delete a user",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { "200": { description: "User deleted" } }
            }
        },
        "/goals": {
            post: {
                tags: ["Goals"],
                summary: "Create a new goal",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
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
                tags: ["Goals"],
                summary: "Get all goals",
                responses: {
                    "200": {
                        description: "List of goals with their tasks and aggregated time",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            title: { type: "string" },
                                            targetHours: { type: "number" },
                                            period: { type: "string" },
                                            loggedHours: { type: "number" },
                                            tasks: {
                                                type: "array",
                                                items: { type: "object" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/goals/{id}": {
            put: {
                tags: ["Goals"],
                summary: "Update a goal",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    targetHours: { type: "number" },
                                    period: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Goal updated successfully" } }
            },
            delete: {
                tags: ["Goals"],
                summary: "Delete a goal",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { "200": { description: "Goal deleted" } }
            }
        },
        "/tasks": {
            post: {
                tags: ["Tasks"],
                summary: "Create a new task",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    startTime: { type: "string", format: "date-time" },
                                    endTime: { type: "string", format: "date-time" },
                                    recurrence: { type: "string" },
                                    goalId: { type: "string" },
                                    isGoalLog: { type: "boolean" },
                                    goalLogId: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Task created" } }
            },
            get: {
                tags: ["Tasks"],
                summary: "Get tasks",
                parameters: [],
                responses: { "200": { description: "List of tasks" } }
            }
        },
        "/tasks/{id}/status": {
            put: {
                tags: ["Tasks"],
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
        "/tasks/{id}": {
            put: {
                tags: ["Tasks"],
                summary: "Update entire task properties",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    startTime: { type: "string", format: "date-time" },
                                    endTime: { type: "string", format: "date-time" },
                                    status: { type: "string" },
                                    recurrence: { type: "string" },
                                    goalId: { type: "string" },
                                    isGoalLog: { type: "boolean" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Task updated successfully" } }
            },
            delete: {
                tags: ["Tasks"],
                summary: "Delete a task",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { "200": { description: "Task deleted" } }
            }
        },
        "/notes": {
            post: {
                tags: ["Notes"],
                summary: "Create a new note",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    content: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Note created" } }
            },
            get: {
                tags: ["Notes"],
                summary: "Get notes",
                parameters: [],
                responses: { "200": { description: "List of notes" } }
            }
        },
        "/notes/{id}": {
            delete: {
                tags: ["Notes"],
                summary: "Delete a note",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { "200": { description: "Note deleted" } }
            }
        },
        "/transactions": {
            post: {
                tags: ["Finance"],
                summary: "Create a new transaction",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    type: { type: "string" },
                                    date: { type: "string", format: "date-time" },
                                    category: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: { "200": { description: "Transaction created" } }
            },
            get: {
                tags: ["Finance"],
                summary: "Get transactions",
                parameters: [],
                responses: { "200": { description: "List of transactions" } }
            }
        },
        "/transactions/{id}": {
            delete: {
                tags: ["Finance"],
                summary: "Delete a transaction",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: { "200": { description: "Transaction deleted" } }
            }
        }
    }
};
