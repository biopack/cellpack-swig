"use strict";
const appRoot = require("app-root-path");
const Swig = require("swig-templates");
const Promise = require("bluebird");
const Lodash = require("lodash");
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
        let templateFunctions = this.environment.get('template.functions', []);
        let templateFilters = this.environment.get('template.filters', []);
        Swig.setDefaults({
            locals: {
                now: () => { return new Date(); },
                time: () => { return Math.round((new Date()).getTime() / 1000); },
                rand: (from, to) => { if (Lodash.isUndefined(to)) {
                    from = 0;
                    to = from;
                } return Math.floor((Math.random() * to) + from); }
            }
        });
        Swig.setFilter('split', (str, separator = ",") => {
            return str.split(separator);
        });
        if (this.environment.get('debug'))
            this.transmitter.emit("log.cellpack.swig", `Loading Filters:`);
        templateFilters.forEach((filter, index, arr) => {
            if (this.environment.get('debug'))
                this.transmitter.emit("log.cellpack.swig", `\t + ${filter.name}`);
            Swig.setFilter(filter.name, filter.func.bind(filter.class));
        });
        if (this.environment.get('debug'))
            this.transmitter.emit("log.cellpack.swig", `done.`);
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
        if (Lodash.isString(template)) {
            let data = connection.environment.get('template.data');
            connection.response.data = Swig.compileFile(`${appRoot}/.cache/templates/${template}`)(data);
        }
        return Promise.resolve(true);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CellpackSwig;
