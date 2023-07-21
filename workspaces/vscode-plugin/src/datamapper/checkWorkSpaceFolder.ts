import { workspace } from 'vscode';

export function checkWorkSpaceFolder(): any {
    const workspaceFolder = workspace.workspaceFolders?.[0];
    return workspaceFolder;
}