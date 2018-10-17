"use strict";
// 从默认配置文件./config/Configger.yml/Configger.json加载配置初始情况
// 支持文件引用
// 支持文件校验
// 支持手动刷新
// 支持配置服务的自动刷新
// 提供配置启动、刷新的event
// 文件内容解密（后继支持）
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Yaml = require('js-yaml');
// import FS   = require('fs');
// function Test() {
//     let doc = null;
//     try {
//         doc = Yaml.safeLoad(FS.readFileSync('./Config/Configger.yml', 'utf8'));
//         console.log(JSON.stringify(doc))
//     } catch (error) {
//         console.log(error)
//     }
// }
// Test();
/// TODO
/// 加载配置之后，根据设置启用的Macros进行配置
// 启动，从schema目录加载配置的schema(C4AJV)
// 获取环境变量和启动参数
// 如果存在App.json，不带-f的参数的话，默认使用App.json中配置
// 如果不存在，则按照环境变量和启动参数启动
// 配置C4Configger，开始加载Config前emit('ConfigLoad')
// 加载完毕后emit('ConfigLoaded');
// 进入启动过程前写.tmp/.App.json
// 执行其他的初始化过程
// emit('init')，开始自定义初始化过程
// 调用C4Framewrok的standby方法，emit('standby')
// 调用C4Framework的run方法，emit('run')
// 调用C4Framework的pause方法，emit('pause')
// 调用C4Framewrok的stop方法，emit('stop')
// 在进程退出前C4Framework发送emit('terminate')
// 调用C4Configger的refresh接口，emit('ConfigRefresh')
const EventEmitter = require("events");
const C4LocalLoader_1 = require("./C4LocalLoader");
const C4RemoteLoader_1 = require("./C4RemoteLoader");
const MacrosProcess_1 = require("./MacrosProcess/MacrosProcess");
const C4ConfigInfo_1 = require("./ConfigTypes/C4ConfigInfo");
const c4utils_1 = require("c4utils");
const Path = require("path");
const Yaml = require("js-yaml");
const C4JSONLoader_1 = require("./LoaderInstance/C4JSONLoader");
const C4YamlLoader_1 = require("./LoaderInstance/C4YamlLoader");
const ConfiggerSchema = "http://sextants/C4Framework/ConfiggerConfig.json";
class C4Configger extends EventEmitter {
    constructor(AppInfo) {
        super();
        this.m_LocalLoader = null;
        this.m_RemoteLoader = null;
        this.m_AJV = AppInfo.Checker || null;
        C4Configger.s_DefaultConfigPath = AppInfo.ConfigPath || C4Configger.s_DefaultConfigPath;
        this.m_ConfigInfo = {
            ConfigDir: {
                Path: '',
                main: ''
            },
            AppName: AppInfo.AppName,
            Version: AppInfo.Version,
            host: AppInfo.host,
            port: AppInfo.port,
            InstanceID: AppInfo.InstanceID,
            Profiles: AppInfo.Profiles,
            Label: AppInfo.Label,
            Macros: [],
            Checker: this.m_AJV
        };
    }
    /**
     * 初始化
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (null === this.m_LocalLoader) {
                this.m_LocalLoader = new C4LocalLoader_1.default();
                this.m_LocalLoader.init();
                this.m_LocalLoader.registerLoader('.yml', () => {
                    return new C4YamlLoader_1.default();
                });
                this.m_LocalLoader.registerLoader('.yaml', () => {
                    return new C4YamlLoader_1.default();
                });
                this.m_LocalLoader.registerLoader('.json', () => {
                    return new C4JSONLoader_1.default();
                });
            }
            try {
                // 加载Configger配置
                let ConfigInfo = yield this.m_LocalLoader.load(process.cwd(), C4Configger.s_DefaultConfigPath, this.m_ConfigInfo);
                // 检查Configger配置
                let ConfigInfoChecker = this.m_AJV.getSchema(ConfiggerSchema);
                if (null === ConfigInfoChecker) {
                    throw new Error('C4Configger init, can not find ConfigInfo schema.');
                }
                let ConfigInfoIsValid = ConfigInfoChecker(ConfigInfo);
                if (!ConfigInfoIsValid) {
                    throw new Error('C4Configger init, load a invalid config info.');
                }
                // 设置加载目录
                this.m_ConfigInfo.ConfigDir = ConfigInfo.ConfigDir;
                // 检查Macros列表
                if (c4utils_1.TypeUtils.isNullOrUndefined(ConfigInfo.Macros)
                    || c4utils_1.TypeUtils.isEmptyObj(ConfigInfo.Macros)
                    || ConfigInfo.Macros.length === 0) {
                    this.m_ConfigInfo.Macros = MacrosProcess_1.default;
                }
                else {
                    for (let i = 0; i < ConfigInfo.Macros.length; i++) {
                        let MacrosName = ConfigInfo.Macros[i];
                        let CurMacrosProcess = MacrosProcess_1.default[MacrosName];
                        if (undefined !== CurMacrosProcess) {
                            // (<C4ConfigInfo>this.m_ConfigInfo).Macros[MacrosName] = CurMacrosProcess
                            this.m_ConfigInfo.Macros.push(CurMacrosProcess);
                        }
                    }
                }
                if (ConfigInfo.ConfigService) {
                    // 存在Config Server的配置，准备远程加载
                    // 说明要从远程加载了
                    this.m_ConfigInfo.ConfigService = ConfigInfo.ConfigService;
                    if (null === this.m_RemoteLoader) {
                        this.m_RemoteLoader = new C4RemoteLoader_1.default();
                        yield this.m_RemoteLoader.init( /*{
                            user        : ConfigInfo.ConfigService.user,
                            password    : ConfigInfo.ConfigService.pass
                        }*/);
                    }
                    else {
                        // 是否重新刷新远程服务配置
                        yield this.m_RemoteLoader.init(/*{
                            user        : ConfigInfo.ConfigService.user,
                            password    : ConfigInfo.ConfigService.pass
                        }*/ {}, true);
                    }
                }
            }
            catch (error) {
                throw error;
            }
            // 要么从文件加载要么从网络加载
            // 先初始化json和yml的loader
            // 判断Config/Configger.yml或者Config/Configger.json是否存在
            // 不存在则抛出异常
            // 存在开始加载
            // 如果存在ConfigService配置，则初始化remote Loader
            // 初始化完毕emit('init');
        });
    }
    /**
     * 加载
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let config;
            try {
                if (null !== this.m_RemoteLoader) {
                    // 从服务加载
                    config = yield this.m_RemoteLoader.load(this.m_ConfigInfo);
                }
                else if (null !== this.m_LocalLoader) {
                    config = yield this.m_LocalLoader.load(this.m_ConfigInfo.ConfigDir.Path, this.m_ConfigInfo.ConfigDir.main, this.m_ConfigInfo);
                }
                else {
                    throw new Error('C4Configger not init.');
                }
            }
            catch (error) {
                throw error;
            }
            C4Configger.g_Config = config;
            // 按照基本基本配置扫描配置文件目录
            // 检查基本配置中每个配置目录的主文件是否存在
            // 不存在抛出异常
            // 存在开始加载，支持引用其他配置文件，但是必须限制
            // 在所配置的目录之中
            // 如果存在远程配置，则尝试加载远程配置
            // 通过AppContext来设置加载的配置的AppName，prof等信息
            // 具备远程配置时除了，Confgger的基本配置、AppContext基本配置外，
            // 其他配置为远程配置覆盖本地配置
            // load结束后emit('loaded');
            // 加载的配以要进行检查
        });
    }
    /**
     * 刷新
     */
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            // 调用之后，重新执行load的过程
            // refresh结束之后，emit('refresh');
            yield this.load();
        });
    }
    /**
     * 获取当前的加载器类型
     */
    loadType() {
        if (null !== this.m_RemoteLoader) {
            return "Remote";
        }
        else if (null !== this.m_LocalLoader) {
            return "Local";
        }
        else {
            return "Unknown";
        }
    }
    /**
     * 将当前数据dump到文件中
     * @param type 输出的文件类型
     * @param savePath 保存的路径
     */
    dump(type, savePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // 将当前配置dump到指定的文件或logger
            try {
                if (null === C4Configger.g_Config) {
                    return;
                }
                let CurSavePath = savePath || this.m_ConfigInfo.ConfigDir.Path;
                CurSavePath = yield c4utils_1.PathUtils.GetAbsolutePath(CurSavePath);
                CurSavePath = Path.resolve(CurSavePath, "./ConfigDump");
                let IsInside = yield c4utils_1.PathUtils.PathInside(process.cwd(), CurSavePath);
                if (IsInside === false) {
                    return;
                }
                CurSavePath = CurSavePath + '.' + type;
                if (type === C4ConfigInfo_1.C4ConfigFileType.Yml
                    || type === C4ConfigInfo_1.C4ConfigFileType.Yaml) {
                    // 写yml
                    yield c4utils_1.FSP.WriteFile(CurSavePath, Yaml.safeDump(C4Configger.g_Config));
                }
                else if (type == C4ConfigInfo_1.C4ConfigFileType.JSON) {
                    CurSavePath = CurSavePath + '.' + type;
                    yield c4utils_1.FSP.WriteFile(CurSavePath, JSON.stringify(C4Configger.g_Config, null, 4));
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
// private m_Loaders : {[key: string] : object};
// private m_Checker : object | null;
C4Configger.s_DefaultConfigPath = './Config/Configger.yml';
C4Configger.g_Config = null;
exports.default = C4Configger;
//# sourceMappingURL=C4Configger.js.map