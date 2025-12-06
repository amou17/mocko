import "@std/dotenv/load";
import { AnyBulkWriteOperation, ObjectId } from "mongodb";

import { MongoConnector } from "./client.ts";

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

    constructor(operations?: AnyBulkWriteOperation<object>[]) {
        this.operations = operations || [];
    }

    async listCollections(): Promise<string[]> {
        try {
            const db = await database.connectedClient();
            const collections = await db.listCollections().toArray();
            return collections.map((col) => col.name);
        } catch (error) {
            console.error("❌ Error listing collections:", error);
            throw error;
        }
    }

    async saveDocuments(collectionName: string) {
        if (this.operations.length > 0) {
            const db = await database.connectedClient();
            const collection = db.collection(collectionName);

            await collection.bulkWrite(this.operations);
            console.log(`✅ Saved ${this.operations.length} documents to collection: ${collectionName}`);
            this.operations = [];
            await database.disconnectClient();
        }
    }

    async insertDocument(document: any) {
        try {
            await this.operations.push({ insertOne: { document: { _id: new ObjectId(), ...document } } });
        } catch (error) {
            console.error("❌ Error inserting document:", error);
            throw error;
        }
    }

    async deleteAllDocuments(collectionName: string){
        try {
            const db = await database.connectedClient();
            const collection = db.collection(collectionName);
            const result = await collection.deleteMany({});
            console.log(`🗑️ Deleted ${result.deletedCount} documents from collection: ${collectionName}`);
            return result.deletedCount;
        } catch (error) {
            console.error("❌ Error deleting documents:", error);
            throw error;
        }
    }

    async createCollection(collectionName: string) {
        try {
            const db = await database.connectedClient();
            await db.createCollection(collectionName);
            console.log(`✅ Collection created: ${collectionName}`);
        } catch (error) {
            console.error("❌ Error creating collection:", error);
            throw error;
        }
    }

    async findDocuments(collectionName: string) {
        try {
            const db = await database.connectedClient();
            const collection = db.collection(collectionName);
            const documents = await collection.find({}).toArray();
            return documents;
        } catch (error) {
            console.log("❌ Error finding documents:", error);
            throw error;
        }
    }

    async deleteCollection(collectionName: string) {
        try {
            const db = await database.connectedClient();
            await db.collection(collectionName).drop();
            console.log(`🗑️ Collection deleted: ${collectionName}`);
        } catch (error) {
            console.error("❌ Error deleting collection:", error);
            throw error;
        }
    }
}