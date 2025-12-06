import { Select } from "@cliffy/prompt";

import { OperationsMongo } from "../db/operations.ts";

export async function collectionCommand(operations: OperationsMongo) {
    const collections =  await operations.listCollections();

    const promptChooseDb: string = await Select.prompt({
        message: "Sélectionnez une collection",
        options: [
            ...collections.map((col) => ({ name: col, value: col })),
            { name: "Quitter", value: "Exit"}
        ],
    })

    return promptChooseDb;
}