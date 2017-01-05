/// <reference types="bluebird" />
import * as Promise from "bluebird";
import { Cellpack, Connection } from "microb";
export default class CellpackSwig extends Cellpack {
    private envInitialized;
    init(): Promise<void>;
    initTemplateEnvironment(): void;
    private templateDump(data);
    request(connection: Connection): Promise<boolean>;
}
