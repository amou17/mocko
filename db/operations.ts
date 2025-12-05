import "@std/dotenv/load";
import { MongoConnector } from "./client.ts";
import { AnyBulkWriteOperation, ObjectId } from "mongodb";

const uri = Deno.env.get("BASE_URL");
const dbName = Deno.env.get("DB_NAME");

if (!uri) {
    throw new Error("BASE_URL is not defined in .env");
}

const database = new MongoConnector({
    uri,
    databaseName: dbName,
});

export class OperationsMongo {
    operations: AnyBulkWriteOperation<object>[];

    constructor() {
        this.operations = [];
    }

    async listCollections(): Promise<string[]> {
        try {
            const db = await database.connectedClient();
            const collections = await db.listCollections().toArray();
            database.disconnectClient()
            return collections.map((col) => col.name);
        } catch (error) {
            console.error("Error listing collections:", error);
            throw error;
        }
    }

    async saveDocuments(collectionName: string) {
        if (this.operations.length > 0) {
            const db = await database.connectedClient();
            const collection = db.collection(collectionName);

            await collection.bulkWrite(this.operations);
            console.log(`🚀 Saved ${this.operations.length} documents to collection: ${collectionName}`);
            this.operations = [];
            await database.disconnectClient();
        }
    }

    async insertDocument(document: any, numberOfDocuments: number) {
        try {
            for (let i = 0; i < numberOfDocuments; i++) {
                await this.operations.push({ insertOne: { document: { _id: new ObjectId(), ...document } } });
            }
        } catch (error) {
            console.error("Error inserting document:", error);
            throw error;
        }
    }
}