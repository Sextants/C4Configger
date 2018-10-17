"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const c4utils_1 = require("c4utils");
const Path = require("path");
const C4BaseLoader_1 = require("./C4BaseLoader");
class C4LocalLoader extends C4BaseLoader_1.default {
    constructor() {
        super();
        this.m_Loaders = new Map();
    }
    init() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            _super("init").call(this);
            // this.m_Loaders  = new Map();
        });
    }
    /**
     * 加载配置
     * @param rootDir 根目录
     * @param loadString 加载文件
     * @param configInfo C4ConfigInfo
     */
    load(rootDir, loadString, configInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取当前工作目录
            // 限制所有的读取都在该当前目录下进行
            rootDir = yield c4utils_1.PathUtils.GetAbsolutePath(rootDir);
            if (rootDir === "") {
                // 无法获取到有效的rootDir，使用process.cwd
                rootDir = process.cwd();
            }
            let IsInside = yield c4utils_1.PathUtils.PathInside(rootDir, loadString);
            if (IsInside === false) {
                throw new Error('Load path : ' + loadString + ' not inside root dir : ' + rootDir);
            }
            let doc = yield this._load(rootDir, loadString, configInfo);
            return doc;
        });
    }
    /**
     * 实际加载的方法
     * @param rootDir 根目录
     * @param loadString 加载文件
     * @param configInfo C4ConfigInfo
     */
    _load(rootDir, loadString, configInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let doc = null;
            let Self = this;
            try {
                let LoadPath = Path.resolve(rootDir, loadString);
                let PathInfo = Path.parse(LoadPath);
                let LoaderFactory = Self.m_Loaders.get(PathInfo.ext.toLowerCase());
                if (LoaderFactory === undefined) {
                    throw new Error('Unknown file type : ' + LoadPath);
                }
                let CurLoader = LoaderFactory();
                doc = yield CurLoader.load(rootDir, LoadPath, configInfo);
                if (null === doc) {
                    throw new Error('Can not find or parse config : ' + LoadPath);
                }
                yield c4utils_1.TypeUtils.objectTrav(doc, (obj, deep, key, type, value) => __awaiter(this, void 0, void 0, function* () {
                    if (type === '[object String]') {
                        try {
                            // 判断是否是文件链接
                            let IsLink = Self._isLink(value);
                            if (IsLink) {
                                let MatchRes = value.match(/^@link:\/\/{[\s\S]+}$/g);
                                let LinkPath = MatchRes[0].replace(/@link:\/\/{/g, '').replace(/}/g, '');
                                let IsInside = yield c4utils_1.PathUtils.PathInside(rootDir, LinkPath);
                                if (IsInside === false) {
                                    throw new Error('Load path : ' + Path + ' not inside root dir : ' + rootDir);
                                }
                                LinkPath = Path.resolve(rootDir, LinkPath);
                                let PathInfo = Path.parse(LinkPath);
                                let LoaderFactory = Self.m_Loaders.get(PathInfo.ext.toLowerCase());
                                if (LoaderFactory === undefined) {
                                    return;
                                }
                                obj[key] = yield Self._load(rootDir, LinkPath, configInfo);
                            }
                            else {
                                // 判断是否是其他标识
                                obj[key] = yield Self._processMacro(value, configInfo);
                            }
                        }
                        catch (error) {
                            throw error;
                        }
                    }
                }));
            }
            catch (error) {
                throw error;
            }
            return doc;
        });
    }
    /**
     * 注册文件加载器
     * @param key 文件扩展名
     * @param loaderFactory 创建加载器的工厂方法
     */
    registerLoader(key, loaderFactory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!c4utils_1.TypeUtils.isString(key)
                || c4utils_1.TypeUtils.isEmptyStr(key)
                || null === loaderFactory
                || !c4utils_1.TypeUtils.isFunction(loaderFactory)) {
                return;
            }
            this.m_Loaders.set(key, loaderFactory);
        });
    }
}
exports.default = C4LocalLoader;
//# sourceMappingURL=C4LocalLoader.js.map