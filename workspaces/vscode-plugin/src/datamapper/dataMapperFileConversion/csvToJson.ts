import toJsonSchema = require("to-json-schema");

export function csvToJson(fileContent: string): toJsonSchema.JSONSchema3or4 {
    var schema: any;
    const csvData: string = fileContent;
    const csvRows: string[] = csvData.split('\n');
    const headers: string[] = csvRows[0].split(';');

    const jsonData: any[] = [];
    for(let i = 1; i < csvRows.length; i++) {
        const row: string[] = csvRows[i].split(';');
        const obj: any = {};

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
        }

        jsonData.push(obj);
    }
    var jsonObj = jsonData;
    var schema1 = toJsonSchema(jsonObj);
    if(schema1.type === 'array') {
        schema = schema1.items;
    } else {
        schema = schema1;
    }
    return schema;
}
