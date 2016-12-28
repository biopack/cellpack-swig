import * as appRoot from "app-root-path"
import * as Swig from "swig-templates"
import * as Promise from "bluebird"
import * as Loadash from "lodash"
//
import { Cellpack, Connection } from "microb"
//
import * as Stream from "stream" // because Microb Response

export default class CellpackSwig extends Cellpack {

    private envInitialized: boolean = false

    initTemplateEnvironment(): void {
        if(this.envInitialized) return
        this.envInitialized = true

        //
        if(this.environment.get('debug')) Swig.setExtension('dump', (data: any) => { return this.templateDump(data) })
    }

    private templateDump(data: any): string {
        return JSON.stringify(data)
    }

    request(connection: Connection){
        if(this.environment.get('debug')) Swig.invalidateCache()

        this.initTemplateEnvironment()

        let template = connection.environment.get('template')
        if(Loadash.isString(template)){
            let data = connection.environment.get('template.data')
            connection.response.data = Swig.compileFile(`${appRoot}/.cache/templates/${template}`)(data)
        }

        return Promise.resolve(true)
    }

}
