import toJsonSchema = require("to-json-schema");

export function JSONtoSchema(fileContent: string): toJsonSchema.JSONSchema3or4 {
    var jsonObj = JSON.parse(fileContent);
    var schema = toJsonSchema(jsonObj);
    return schema;
}
