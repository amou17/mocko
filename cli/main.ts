import { parseArgs } from "@std/cli/parse-args";
import { analyzeSchemaJSON } from "../core/schema-analyzer.ts";
import { OperationsMongo } from "../db/operations.ts";


const args = parseArgs(Deno.args);


const documentJSON = await analyzeSchemaJSON(args.file as string);
const operations = new OperationsMongo();

await operations.insertDocument(documentJSON, 5);
await operations.saveDocuments(args.collection as string);