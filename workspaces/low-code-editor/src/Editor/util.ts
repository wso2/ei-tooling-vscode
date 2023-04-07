
export function sanitizeBadJson(inputJson: string): string {
    return inputJson
        // Replace ":" with "@colon@" if it's between double-quotes
        .replace(/:\s*"([^"]*)"/g, function (match, p1) {
            return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })
        // Replace ":" with "@colon@" if it's between single-quotes
        .replace(/:\s*'([^']*)'/g, function (match, p1) {
            return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })
        // Add double-quotes around any tokens before the remaining ":"
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
        // Turn "@colon@" back into ":"
        .replace(/@colon@/g, ':')
}
