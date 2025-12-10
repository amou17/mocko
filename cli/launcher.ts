import { Command } from "@cliffy/command";
import { Number, Confirm } from "@cliffy/prompt";

import { OperationsMongo } from "../db/operations.ts";
import { analyzeSchemaJSON } from "../core/schema-analyzer.ts";
import { collectionCommand, firstCommand, exitCommand, createCommand } from "./index.ts";

await new Command()
    .name("CLI mocko - Data Generator")
    .version("0.1.0")
    .description("List of available Mongo collections in the database")
    .command("Lists")
    .option("-f, --file <path:string>", "Chemin vers le fichier schema JSON", { required: true })
    .action(async (options) => {
        const operations = new OperationsMongo();

        async function handleCollectionFlow() {
            const promptChooseDb: string = await collectionCommand(operations);

            if( promptChooseDb ) {
                if( promptChooseDb === "Exit" ) {
                    exitCommand();
                }
                
                console.log(`Vous avez sélectionné la collection : ${promptChooseDb}`);

                let promptDelete = false;
                const existingDocuments = await operations.findDocuments(promptChooseDb);
                if( existingDocuments.length > 0) {
                    promptDelete = await Confirm.prompt("Voulez-vous supprimer tous les documents existants dans cette collection avant d'insérer de nouveaux documents ?");
                }

                if( promptDelete ) {
                    await operations.deleteAllDocuments(promptChooseDb);
                }

                const promptInsert: number = await Number.prompt({
                    message: "Combien de documents voulez-vous insérer dans cette collection ?",
                    min: 0,
                    max: 10000,
                    hint: "Entrez un nombre",
                });

                if( promptInsert <= 0 ) {
                    console.log("Aucun document à insérer");
                    Deno.exit(0);
                }

                const outputDocuments: unknown[] = []
                
                for(let i =0; i < promptInsert; i++) {
                    outputDocuments.push(await analyzeSchemaJSON(options.file));
                }
                for (const documentJSON of outputDocuments) {
                    await operations.insertDocument(documentJSON);
                }

                await operations.saveDocuments(promptChooseDb);
            }
        }

        const promptChoice: string = await firstCommand();

        if(promptChoice === "Create") {
            await createCommand(operations);
            await handleCollectionFlow();
            Deno.exit(0);
        }

        if(promptChoice === "Delete") {
            const promptCollectionName: string = await collectionCommand(operations);
            
            if (promptCollectionName === "Exit") {
                exitCommand();
            }
            
            const confirmDelete = await Confirm.prompt(`Êtes-vous sûr de vouloir supprimer la collection "${promptCollectionName}" ?`);
            
            if (confirmDelete) {
                await operations.deleteCollection(promptCollectionName);
            }
            
            Deno.exit(0);
        }

        if( promptChoice === "Yes") {
            await handleCollectionFlow();
            Deno.exit(0);
        } else if (promptChoice === "Exit") {
            exitCommand();
            Deno.exit(0);
        }
    })
    .parse(Deno.args);