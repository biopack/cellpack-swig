import * as appRoot from "app-root-path"
import * as Swig from "swig-templates"
import * as Promise from "bluebird"
import * as Lodash from "lodash"
//
import { Cellpack, Connection } from "microb"
//
import * as Stream from "stream" // because Microb Response

export default class CellpackSwig extends Cellpack {

    private envInitialized: boolean = false

    init(){
        this.config = this.environment.get("cellpacks")["cellpack-swig"]
        return Promise.resolve()
    }

    initTemplateEnvironment(): void {
        if(this.envInitialized) return
        this.envInitialized = true

        let templateFunctions = this.environment.get('template.functions',[])
        let templateFilters = this.environment.get('template.filters',[])

        // defaults
        let defaults: any = {
            locals: {
                now: () => { return new Date() },
                time: () => { return Math.round((new Date()).getTime()/1000) },
                rand: (from: number, to?: number) => { if(Lodash.isUndefined(to)){ from = 0; to = from; } return Math.floor((Math.random() * to) + from)  }
            }
        }

        if(Lodash.isObject(this.config.globals)){
            Object.keys(this.config.globals).forEach((key: string,index: number, arr: Array<string>) => {
                defaults.locals[key] = this.config.globals[key]
            })
        }

        if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.swig",`Loading Functions:`)
        templateFunctions.forEach((func: any, index: number, arr: Array<string>) => {
            if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.swig",`\t + ${func.name}`)
            defaults.locals[func.name] = func.func.bind(func.class)
        })
        Swig.setDefaults(defaults)
        if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.swig",`done.`)

        // filters
        Swig.setFilter('split', (str: string, separator: string = ",") => {
            return str.split(separator)
        })

        // environment filters
        if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.swig",`Loading Filters:`)
        templateFilters.forEach((filter: any, index: number, arr: Array<string>) => {
            if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.swig",`\t + ${filter.name}`)
            Swig.setFilter(filter.name, filter.func.bind(filter.class))
        })
        if(this.environment.get('debug')) this.transmitter.emit("log.cellpack.swig",`done.`)

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
        if(Lodash.isString(template)){
            let data = connection.environment.get('template.data')
            connection.response.data = Swig.compileFile(`${appRoot}/.cache/templates/${template}`)(data)
        }

        return Promise.resolve(true)
    }

}
