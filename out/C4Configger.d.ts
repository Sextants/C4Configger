/// <reference types="node" />
import EventEmitter = require('events');
import C4AJV from 'c4ajv';
import { C4ConfigFileType } from './ConfigTypes/C4ConfigInfo';
export default class C4Configger extends EventEmitter {
    private m_LocalLoader;
    private m_RemoteLoader;
    private m_AJV;
    private m_ConfigInfo;
    private static s_DefaultConfigPath;
    static g_Config: any;
    constructor(AppInfo: {
        AppName: string;
        Version: string;
        host: string;
        port: number;
        InstanceID: string;
        Profiles: string[] | string;
        Label?: string;
        Checker: C4AJV;
        ConfigPath?: string;
    });
    /**
     * 初始化
     */
    init(): Promise<void>;
    /**
     * 加载
     */
    load(): Promise<void>;
    /**
     * 刷新
     */
    refresh(): Promise<void>;
    /**
     * 获取当前的加载器类型
     */
    loadType(): "Remote" | "Local" | "Unknown";
    /**
     * 将当前数据dump到文件中
     * @param type 输出的文件类型
     * @param savePath 保存的路径
     */
    dump(type: C4ConfigFileType, savePath?: string): Promise<void>;
}
