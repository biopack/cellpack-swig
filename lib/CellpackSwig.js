"use strict";
const appRoot = require("app-root-path");
const Swig = require("swig-templates");
const Promise = require("bluebird");
const Loadash = require("lodash");
const microb_1 = require("microb");
class CellpackSwig extends microb_1.Cellpack {
    constructor() {
        super(...arguments);
        this.envInitialized = false;
    }
    initTemplateEnvironment() {
        if (this.envInitialized)
            return;
        this.envInitialized = true;
        if (this.environment.get('debug'))
            Swig.setExtension('dump', (data) => { return this.templateDump(data); });
    }
    templateDump(data) {
        return JSON.stringify(data);
    }
    request(connection) {
        if (this.environment.get('debug'))
            Swig.invalidateCache();
        this.initTemplateEnvironment();
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
