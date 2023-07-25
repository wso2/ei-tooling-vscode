import {processors} from "xml2js";

export function xmlToJson(fileContent: string,): string {
    var schema1 = "";
    var parseString = require('xml2js').parseString;
    var xml = fileContent;
    const options = {
        explicitArray: false,
        explicitRoot: false,
        preserveChildrenOrder: true,
        tagNameProcessors: [processors.stripPrefix],
        valueProcessors: [
            (value : string) => {
                if (value === '$') {
                    return undefined; // Remove the '$' mark
                }
                return value;
            },
        ],
        attrValueProcessors: [
            (value : string, name : string) => {
                if (name.startsWith('xmlns:')) {
                    return undefined; // Remove the 'xmlns:ns' attribute
                }
                return value;
            },
        ]
    };
    parseString(xml, options, function (err: any, result: any) {
        schema1 = result;
    });
    var obj = JSON.parse(JSON.stringify(schema1));
    for (const prop in obj) {
        if (prop.startsWith('$')) {
            delete obj[prop];
        }
    }
    return JSON.stringify(obj, null, 1);
}
