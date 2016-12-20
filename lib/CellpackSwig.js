"use strict";
const appRoot = require("app-root-path");
const Swig = require("swig-templates");
const Promise = require("bluebird");
const Loadash = require("lodash");
const microb_1 = require("microb");
class CellpackSwig extends microb_1.Cellpack {
    request(connection) {
        let template = connection.environment.get('template');
        if (Loadash.isString(template)) {
            let data = connection.environment.get('template.data');
            connection.response.data = Swig.compileFile(`${appRoot}/.cache/templates/${template}`)(data);
        }
        return Promise.resolve(true);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CellpackSwig;
