import { C4ConfiggerOptions } from './ConfigTypes/C4ConfiggerOptions';
export default class C4BaseLoader {
    constructor();
    init(): Promise<void>;
    /**
     * 处理宏
     * @param value 当前值
     * @param configInfo C4ConfigInfo
     */
    _processMacro(value: string, configInfo: C4ConfiggerOptions): Promise<string>;
    /**
     * 判断是否是文件引用
     * @param value 当前配置项的值
     */
    _isLink(value: string): boolean;
}
