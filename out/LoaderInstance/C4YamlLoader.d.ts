import C4ConfigLoaderInterface from './C4ConfigLoaderInterface';
import { C4ConfiggerOptions } from '../ConfigTypes/C4ConfiggerOptions';
export default class C4YamlLoader extends C4ConfigLoaderInterface {
    init(initString: string): Promise<void>;
    load(rootDir: string, loadString: string, configInfo: C4ConfiggerOptions): Promise<any>;
}
