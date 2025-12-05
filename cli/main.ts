import { parseArgs } from "@std/cli/parse-args";
import { analyzeSchemaJSON } from "../core/schema-analyzer.ts";
import { OperationsMongo } from "../db/operations.ts";


const args = parseArgs(Deno.args);

const outputDocuments: unknown[] = []

for(let i =0; i < args.totalDocuments; i++) {
    outputDocuments.push(await analyzeSchemaJSON(args.file as string));
}

const operations = new OperationsMongo();

for (const documentJSON of outputDocuments) {
    await operations.insertDocument(documentJSON);
}

await operations.saveDocuments(args.collection as string);
