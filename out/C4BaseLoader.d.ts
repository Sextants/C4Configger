import { C4ConfigInfo } from './ConfigTypes/C4ConfigInfo';
export default class C4BaseLoader {
    constructor();
    init(): Promise<void>;
    /**
     * 处理宏
     * @param value 当前值
     * @param configInfo C4ConfigInfo
     */
    _processMacro(value: string, configInfo: C4ConfigInfo): Promise<string>;
    /**
     * 判断是否是文件引用
     * @param value 当前配置项的值
     */
    _isLink(value: string): boolean;
}
