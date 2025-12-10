import { Select } from "@cliffy/prompt";

export async function firstCommand() {
    const promptChoice = await Select.prompt({
        message: "Que voulez-vous faire maintenant ?",
        options: [
            { name: "Choisir une collection", value: "Yes"},
            { name: "Créer une collection", value: "Create"},
            { name: "Supprimer une collection", value: "Delete"},
            { name: "Quitter", value: "Exit"},
        ],
    });

    return promptChoice;
}