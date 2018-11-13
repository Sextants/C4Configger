import { ClientOption } from 'c4restfulclient';
import { C4ConfiggerOptions } from './ConfigTypes/C4ConfiggerOptions';
import C4BaseLoader from './C4BaseLoader';
export default class C4RemoteLoader extends C4BaseLoader {
    private m_Client;
    constructor();
    /**
     * 初始化
     * @param option ClientOption
     * @param changeServer 是否切换Client配置
     */
    init(option?: ClientOption, changeServer?: boolean): void;
    /**
     * 加载配置
     * @param configInfo C4ConfigInfo
     */
    load(configInfo: C4ConfiggerOptions): Promise<{
        [profile: string]: any;
        version: string | null;
        state: string | null;
        label: string | null;
    } | null>;
    /**
     * 对结果进行解析
     * @param config 返回的配置项
     * @param configInfo C4ConfigInfo
     */
    _parse(config: any, configInfo: C4ConfiggerOptions): {
        [profile: string]: any;
        version: string | null;
        state: string | null;
        label: string | null;
    } | null;
}
