import { Db, MongoClient } from "mongodb";

let client: MongoClient;
let database: Db;

type DatabaseConfig = {
    uri: string;
    databaseName?: string;
}

type DatabaseCloseConfig = {
    close(): void;
}

export class MongoConnector {
    uri: string;
    databaseName: string;
    database?: DatabaseCloseConfig;

    constructor(params: DatabaseConfig) {
        const { uri, databaseName} = params;
        this.uri = uri;
        this.databaseName = databaseName || "test";
    }

    async connectedClient(): Promise<Db> {
        try {
            client = new MongoClient(this.uri);
            await client.connect();

            database = client.db(this.databaseName);

            console.log("🚀 Connected to database");
            return database;
        } catch (error) {
            console.error("Failed to connect to database", error);
            throw error;
        }
    }

    async disconnectClient(): Promise<void> {
        if (client) {
            await client.close();
            console.log("Disconnected from database");
        }
    }

    async getDatabase() {
        if (!database) {
            await this.connectedClient();
        }
        return this.database as DatabaseCloseConfig;
    }
}