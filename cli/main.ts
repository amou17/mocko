import { parseArgs } from "@std/cli/parse-args";
import { analyzeSchemaJSON } from "../core/schema-analyzer.ts";

const args = parseArgs(Deno.args);
console.log("args", args)

await analyzeSchemaJSON(args.file as string);