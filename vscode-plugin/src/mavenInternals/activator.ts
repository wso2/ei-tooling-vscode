'use strict';

import * as vscode from 'vscode';
import { Uri} from "vscode";
import { ArchetypeModule } from "../archetype/ArchetypeModule";

function registerCommand(context: vscode.ExtensionContext, commandName: string, func: (...args: any[]) => any, withOperationIdAhead?: boolean): void {
    const commandHandler = (name: string = 'world') => {
        console.log(`Hello ${name}!!!`);
      };
    context.subscriptions.push(vscode.commands.registerCommand(commandName, commandHandler));
}

function doActivate(context: vscode.ExtensionContext): void {

    registerCommand(context, "maven.archetype.generate", async (operationId: string, entry: Uri | undefined) => {
        await ArchetypeModule.generateFromArchetype(entry);
    }, true);
}




