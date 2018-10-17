import C4ConfigLoaderInterface from './C4ConfigLoaderInterface';
import { C4ConfigInfo } from '../ConfigTypes/C4ConfigInfo';
export default class C4JSONLoader extends C4ConfigLoaderInterface {
    init(initString: string): Promise<void>;
    load(rootDir: string, loadString: string, configInfo: C4ConfigInfo): Promise<any>;
}
