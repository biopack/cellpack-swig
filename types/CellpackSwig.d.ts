/// <reference types="bluebird" />
import * as Promise from "bluebird";
import { Cellpack, Connection } from "microb";
export default class CellpackSwig extends Cellpack {
    request(connection: Connection): Promise<boolean>;
}
