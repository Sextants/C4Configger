import { C4RESTFulClient, ClientOption, RequestOption } from 'c4restfulclient'
import { C4ConfigInfo, C4ConfigDir, C4ConfigService, Macro }            from './ConfigTypes/C4ConfigInfo';
import { TypeUtils } from 'c4utils';
import C4BaseLoader from './C4BaseLoader';
import C4AJV from 'c4ajv';

export default class C4RemoteLoader extends C4BaseLoader {
    private m_Client : C4RESTFulClient | null;

    constructor() {
        super();
        this.m_Client   = null;
    }

    /**
     * 初始化
     * @param option ClientOption
     * @param changeServer 是否切换Client配置
     */
    async init(option ?: ClientOption, changeServer : boolean = false) {
        super.init();
        if (this.m_Client === null) {
            this.m_Client   = new C4RESTFulClient();
            this.m_Client.init(option);
        } else if (changeServer) {
            this.m_Client   = new C4RESTFulClient();
            this.m_Client.init(option);
        }
    }

    /**
     * 加载配置
     * @param configInfo C4ConfigInfo
     */
    async load(configInfo : C4ConfigInfo) {
        if (null === this.m_Client) {
            throw new Error('C4RemoteLoader not init.');
        }

        let Self = this;
        let ProfilesIsValid : boolean | any = false;
        try {
          if (configInfo.Checker) {
            ProfilesIsValid = (<C4AJV>configInfo.Checker).validate("Profiles", <object>configInfo.Profiles);
          } else {
            ProfilesIsValid = true;
          }
        } catch (error) {
            throw error;
        }

        // 只支持dev，test，prod，default
        if (!ProfilesIsValid) {
            throw new Error('C4RemoteLoader unknown Profiles, ' + JSON.stringify(configInfo.Profiles));
        }

        let curRequestOption : RequestOption = {};
        (<any>curRequestOption).timeout = 10000;
        if ((<C4ConfigService>configInfo.ConfigService).user) {
            (<any>curRequestOption).auth = {
                'username' : (<C4ConfigService>configInfo.ConfigService).user,
                'password' : (<C4ConfigService>configInfo.ConfigService).pass
            }
        }

        // 构造请求
        let ConfigRes = await this.m_Client.get(
            (<C4ConfigService>configInfo.ConfigService).host + '/'
            + configInfo.AppName + '/'
            + configInfo.Profiles + '/'
            + (configInfo.Label || ''),
            curRequestOption
            // <RequestOption>{
            //     'auth' : {
            //         'username' : (<C4ConfigService>configInfo.ConfigService).user,
            //         'password' : (<C4ConfigService>configInfo.ConfigService).pass
            //     },
            //     timeout : 10000
            // }
        ).catch((err) => {
            throw err;
        });

        // this.m_Client.registerMethod(
        //     (<C4ConfigService>configInfo.ConfigService).host,
        //     (<C4ConfigService>configInfo.ConfigService).host + '/'
        //     + configInfo.AppName + '/'
        //     + configInfo.Profiles + '/'
        //     + (configInfo.Label || ''),
        //     "GET"
        // );

        // // 请求配置
        // let ConfigRes = await (<Promise<{data ?: any, response ?: any}>>this.m_Client.methods(
        //     (<C4ConfigService>configInfo.ConfigService).host,
        //     <C4RESTFulClientRequestConfig>{
        //         user : (<C4ConfigService>configInfo.ConfigService).user,
        //         password : (<C4ConfigService>configInfo.ConfigService).pass,
        //         requestConfig : {
        //             timeout : 10000
        //         },
        //         responseConfig : {
        //             timeout : 10000
        //         }
        // })).catch((err) => {
        //     throw err;
        // });

        // 检查是否返回了有效值
        if (TypeUtils.isNullOrUndefined(ConfigRes.body)) {
            throw new Error('C4RemoteLoader get config failed.');
        }

        if (TypeUtils.isNullOrUndefined(ConfigRes.body.name)) {
            throw new Error('C4RemoteLoader get config failed, ' + JSON.stringify(ConfigRes.body));
        }

        console.log(ConfigRes.body);
        try {
            // 解析数据
            let Doc = this._parse(ConfigRes.body, configInfo);
            // 遍历对象处理宏
            await TypeUtils.objectTrav(Doc, async (obj, deep, key, type, value) => {
                if (type === '[object String]') {
                    try {
                        // 处理宏
                        obj[key] = await Self._processMacro(value, configInfo);
                    } catch (error) {
                        throw error;
                    }
                }
            })
            return Doc;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * 对结果进行解析
     * @param config 返回的配置项
     * @param configInfo C4ConfigInfo
     */
    _parse(config : any, configInfo : C4ConfigInfo) {
        if (TypeUtils.isNullOrUndefined(config)
            || TypeUtils.isEmptyObj(config)) {
            return null;
        }

        let doc : any = {};

        let MatchReg = new RegExp('/' + configInfo.AppName + '-*\\w*\\.', 'g');
        let MatchReg2= new RegExp('/' + configInfo.AppName + '-*', 'g');
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
                let CurSourceItem   = config.propertySources[i];
                let CurName         = CurSourceItem.name;
                let CurSource       = CurSourceItem.source;

                // 获取当前配置的Profile
                MatchReg.lastIndex  = 0;
                let MatchCount      = 0;
                let MatchRes        = null;;
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
                if (CurProfile === "") CurProfile = "default"

                // 解析当前Profile配置
                doc[CurProfile] = TypeUtils.configObj2JSObj(CurSource);
            }

            return doc;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
