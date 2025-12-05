import { Command } from "@cliffy/command";
import { Select, Number, Confirm } from "@cliffy/prompt";

import { OperationsMongo } from "../../db/operations.ts";
import { analyzeSchemaJSON } from "../../core/schema-analyzer.ts";

await new Command()
    .name("CLI mocko - Data Generator")
    .version("0.1.0")
    .description("List of available Mongo collections in the database")
    .command("Lists")
    .option("-f, --file <path:string>", "Chemin vers le fichier schema JSON", { required: true })
    .action(async (options) => {
        const operations = new OperationsMongo();

        const promptChoice = await Select.prompt({
            message: "Que voulez-vous faire maintenant ?",
            options: [
                { name: "Lister les collections", value: "Yes"},
                { name: "Quitter", value: "Exit"},
            ],
        });

        if( promptChoice === "Yes") {
            const collections =  await operations.listCollections();

            const promptChooseDb: string = await Select.prompt({
                message: "Sélectionnez une collection",
                options: [
                    ...collections.map((col) => ({ name: col, value: col })),
                    { name: "Quitter", value: "Exit"}
                ],
            })

            if( promptChooseDb ) {
                if( promptChooseDb === "Exit") {
                    console.log("Au revoir !");
                    Deno.exit(0);
                } else {
                    console.log(`Vous avez sélectionné la collection : ${promptChooseDb}`);

                    const promptDelete: boolean = await Confirm.prompt("Voulez-vous supprimer tous les documents existants dans cette collection avant d'insérer de nouveaux documents ?");

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

                    Deno.exit(0);
                }
            }
        } else if (promptChoice === "Exit") {
            console.log("Au revoir !");
            Deno.exit(0);
        }
    })
    .parse(Deno.args);