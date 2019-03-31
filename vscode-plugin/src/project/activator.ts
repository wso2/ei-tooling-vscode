import { window, Uri, commands } from "vscode";

export function promptOpenFolder(path: string) {
    
    window.showInformationMessage("How would you like to open the project? ", "New Window", "Cancel", "This Window" )
        .then((selection) => {
            if (selection === "This Window") {
                // workspace.updateWorkspaceFolders(0, 0, { uri: Uri.file(path)});
                commands.executeCommand('vscode.openFolder', Uri.file(path));
            }else if(selection === "New Window") {
                commands.executeCommand('vscode.openFolder', Uri.file(path), true);
            }
        });
}
