import { Input } from "@cliffy/prompt";
import { OperationsMongo } from "../../db/operations.ts";

export async function createCommand(operations: OperationsMongo) {
    const promptCollectionName: string = await Input.prompt({
        message: "Entrez le nom de la nouvelle collection :",
        validate: (value) => {
            if (value.trim().length === 0) {
                return "Le nom de la collection ne peut pas être vide.";
            }
            return true;
        }
    });
    await operations.createCollection(promptCollectionName);
}