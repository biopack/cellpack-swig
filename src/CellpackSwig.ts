import * as appRoot from "app-root-path"
import * as Swig from "swig-templates"
import * as Promise from "bluebird"
import * as Loadash from "lodash"
//
import { Cellpack, Connection } from "microb"
//
import * as Stream from "stream" // because Microb Response

export default class CellpackSwig extends Cellpack {

    request(connection: Connection){
        // if(this.config.is('debug')) Swig.invalidateCache()

        // Swig.setExtension('dump', this.templateDump)

        let template = connection.environment.get('template')
        if(Loadash.isString(template)){
            let data = connection.environment.get('template.data')
            connection.response.data = Swig.compileFile(`${appRoot}/.cache/templates/${template}`)(data)
        }

        return Promise.resolve(true)
    }

}
