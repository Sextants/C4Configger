import StripJsonComments    = require('strip-json-comments');
import { FSP, PathUtils }       from 'c4utils';
import C4ConfigLoaderInterface  from './C4ConfigLoaderInterface';
import { C4ConfigInfo }         from '../ConfigTypes/C4ConfigInfo';

export default class C4JSONLoader extends C4ConfigLoaderInterface {

    async init(initString : string) {
        //
    }

    async load(rootDir : string, loadString : string, configInfo : C4ConfigInfo) {
        // 获取当前工作目录
        // 限制所有的读取都在该当前目录下进行
        rootDir = await PathUtils.GetAbsolutePath(rootDir);
        if (rootDir === "") {
            // 无法获取到有效的rootDir，使用process.cwd
            rootDir = process.cwd();
        }
        let IsInside    = await PathUtils.PathInside(rootDir, loadString);
        if (IsInside === false) {
            throw new Error('Load path : ' + loadString + ' not inside root dir : ' + rootDir);
        }
        let doc = null;
        try {
            let fileData = await FSP.ReadFile(loadString, {
                flag : 'r',
                encoding : 'utf8'
            });
            doc = JSON.parse(StripJsonComments(<string>fileData));
            return doc;
        } catch (error) {
            throw error;
        }
    }
}
