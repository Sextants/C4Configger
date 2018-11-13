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
const c4restfulclient_1 = require("c4restfulclient");
const c4utils_1 = require("c4utils");
const C4BaseLoader_1 = require("./C4BaseLoader");
class C4RemoteLoader extends C4BaseLoader_1.default {
    constructor() {
        super();
        this.m_Client = null;
    }
    /**
     * 初始化
     * @param option ClientOption
     * @param changeServer 是否切换Client配置
     */
    init(option, changeServer = false) {
        super.init();
        if (this.m_Client === null) {
            this.m_Client = new c4restfulclient_1.C4RESTFulClient();
            this.m_Client.init(option);
        }
        else if (changeServer) {
            this.m_Client = new c4restfulclient_1.C4RESTFulClient();
            this.m_Client.init(option);
        }
    }
    /**
     * 加载配置
     * @param configInfo C4ConfigInfo
     */
    load(configInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (null === this.m_Client) {
                throw new Error('C4RemoteLoader not init.');
            }
            let Self = this;
            let ProfilesIsValid = false;
            try {
                if (configInfo.Checker) {
                    ProfilesIsValid = configInfo.Checker.validate("Profiles", configInfo.Profiles);
                }
                else {
                    ProfilesIsValid = true;
                }
            }
            catch (error) {
                throw error;
            }
            // 只支持dev，test，prod，default
            if (!ProfilesIsValid) {
                throw new Error('C4RemoteLoader unknown Profiles, ' + JSON.stringify(configInfo.Profiles));
            }
            let curRequestOption = {};
            curRequestOption.timeout = configInfo.ConfigService.timeout || 60000;
            if (configInfo.ConfigService.user) {
                curRequestOption.auth = {
                    'username': configInfo.ConfigService.user,
                    'password': configInfo.ConfigService.pass
                };
            }
            // 构造请求
            let ConfigRes = yield this.m_Client.get(configInfo.ConfigService.host + '/'
                + configInfo.AppName + '/'
                + configInfo.Profiles + '/'
                + (configInfo.Label || ''), curRequestOption).catch((err) => {
                throw err;
            });
            // 检查是否返回了有效值
            if (c4utils_1.TypeUtils.isNullOrUndefined(ConfigRes.body)) {
                throw new Error('C4RemoteLoader get config failed.');
            }
            if (c4utils_1.TypeUtils.isNullOrUndefined(ConfigRes.body.name)) {
                throw new Error('C4RemoteLoader get config failed, ' + JSON.stringify(ConfigRes.body));
            }
            // console.log(ConfigRes.body);
            try {
                // 解析数据
                let Doc = this._parse(ConfigRes.body, configInfo);
                // 遍历对象处理宏
                yield c4utils_1.TypeUtils.objectTrav(Doc, (obj, deep, key, type, value) => __awaiter(this, void 0, void 0, function* () {
                    if (type === '[object String]') {
                        try {
                            // 处理宏
                            obj[key] = yield Self._processMacro(value, configInfo);
                        }
                        catch (error) {
                            throw error;
                        }
                    }
                }));
                return Doc;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    /**
     * 对结果进行解析
     * @param config 返回的配置项
     * @param configInfo C4ConfigInfo
     */
    _parse(config, configInfo) {
        if (c4utils_1.TypeUtils.isNullOrUndefined(config)
            || c4utils_1.TypeUtils.isEmptyObj(config)) {
            return null;
        }
        let doc = {
            version: config.version,
            state: config.state,
            label: config.label,
        };
        let MatchReg = new RegExp('/' + configInfo.AppName + '-*\\w*\\.', 'g');
        let MatchReg2 = new RegExp('/' + configInfo.AppName + '-*', 'g');
        try {
            // {
            //     name : 'sdfsdfsdf/app01-dev.yml',
            //     source : {
            //         xxx[0].Path : '123',
            //         xxx[1].main : 'sadsd',
            //         oooo.host : 'sdfdsf'
            //     }
            // }
            for (let i = 0; i < config.propertySources.length; i++) {
                let CurSourceItem = config.propertySources[i];
                let CurName = CurSourceItem.name;
                let CurSource = CurSourceItem.source;
                // 获取当前配置的Profile
                MatchReg.lastIndex = 0;
                let MatchCount = 0;
                let MatchRes = null;
                ;
                do {
                    let CurMatchRes = MatchReg.exec(CurName);
                    if (null === CurMatchRes)
                        break;
                    MatchRes = CurMatchRes;
                    MatchCount++;
                } while (true);
                if (null === MatchRes
                    || MatchCount > 1) {
                    continue;
                }
                // TODO: 改成正则
                let CurProfile = MatchRes[0].replace(MatchReg2, '').replace('.', '');
                if (CurProfile === "")
                    CurProfile = "default";
                // 解析当前Profile配置
                doc[CurProfile] = c4utils_1.TypeUtils.configObj2JSObj(CurSource);
            }
            return doc;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}
exports.default = C4RemoteLoader;
//# sourceMappingURL=C4RemoteLoader.js.map