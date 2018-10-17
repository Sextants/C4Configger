import C4ConfigLoaderInterface   from './LoaderInstance/C4ConfigLoaderInterface';
import { C4ConfigInfo }          from './ConfigTypes/C4ConfigInfo';
import { TypeUtils, PathUtils } from 'c4utils';
import Path         = require('path');
import C4BaseLoader from './C4BaseLoader';

export default class C4LocalLoader extends C4BaseLoader {
    private m_Loaders : Map<string, () => C4ConfigLoaderInterface>;
    constructor() {
        super();
        this.m_Loaders  = new Map();
    }

    async init() {
        super.init();
        // this.m_Loaders  = new Map();
    }

    /**
     * 加载配置
     * @param rootDir 根目录
     * @param loadString 加载文件
     * @param configInfo C4ConfigInfo
     */
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
        let doc = await this._load(rootDir, loadString, configInfo);
        return doc;
    }

    /**
     * 实际加载的方法
     * @param rootDir 根目录
     * @param loadString 加载文件
     * @param configInfo C4ConfigInfo
     */
    async _load(rootDir : string, loadString : string, configInfo : C4ConfigInfo) {
        let doc     = null;
        let Self    = this;
        try {
            let LoadPath        = Path.resolve(rootDir, loadString);
            let PathInfo        = Path.parse(LoadPath);
            let LoaderFactory   = Self.m_Loaders.get(PathInfo.ext.toLowerCase());
            if (LoaderFactory === undefined) {
                throw new Error('Unknown file type : ' + LoadPath);
            }

            let CurLoader   = LoaderFactory();
            doc = await CurLoader.load(rootDir, LoadPath, configInfo);
            if (null === doc) {
                throw new Error('Can not find or parse config : ' + LoadPath);
            }
            await TypeUtils.objectTrav(doc, async (obj, deep, key, type, value) => {
                if (type === '[object String]') {
                    try {
                        // 判断是否是文件链接
                        let IsLink = Self._isLink(value);
                        if (IsLink) {
                            let MatchRes = value.match(/^@link:\/\/{[\s\S]+}$/g);
                            let LinkPath    = MatchRes[0].replace(/@link:\/\/{/g, '').replace(/}/g, '');
                            let IsInside    = await PathUtils.PathInside(rootDir, LinkPath);
                            if (IsInside === false) {
                                throw new Error('Load path : ' + Path + ' not inside root dir : ' + rootDir);
                            }
                            LinkPath        = Path.resolve(rootDir, LinkPath);
                            let PathInfo    = Path.parse(LinkPath);
                            let LoaderFactory   = Self.m_Loaders.get(PathInfo.ext.toLowerCase());
                            if (LoaderFactory === undefined) {
                                return;
                            }

                            obj[key] = await Self._load(rootDir, LinkPath, configInfo);
                        } else {
                            // 判断是否是其他标识
                            obj[key] = await Self._processMacro(value, configInfo);
                        }
                    } catch (error) {
                        throw error;
                    }
                }
            });
        } catch (error) {
            throw error;
        }

        return doc;
    }

    /**
     * 注册文件加载器
     * @param key 文件扩展名
     * @param loaderFactory 创建加载器的工厂方法
     */
    async registerLoader(key : string, loaderFactory : () => C4ConfigLoaderInterface) {
        if (!TypeUtils.isString(key)
            || TypeUtils.isEmptyStr(key)
            || null === loaderFactory
            || !TypeUtils.isFunction(loaderFactory)) {
            return;
        }

        this.m_Loaders.set(key, loaderFactory);
    }
}
