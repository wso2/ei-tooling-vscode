import { integer } from "vscode-languageserver-protocol";

export function StringOperationPush2(row: any[], action: {}, j: integer, h4: string): string {
    if (!row[j + 2] || !row[j] || row[j + 4]) {
        return "";
    }
    let f = "";
    let action2 = action.toString().charAt(0).toLowerCase() + action.toString().slice(1);
    if (action === "Concat") {
        f = ".";
    }
    row[j + 4] = true;
    return `${row[j + 3]} = ${row[j - 1]}${h4}.${action2}` + f + `(${row[j + 1]}${h4});`;
}