import { C4ConfigInfo }         from './ConfigTypes/C4ConfigInfo';
import { TypeUtils, PathUtils } from 'c4utils';

export default class C4BaseLoader {
    constructor() {}

    async init() {}

    /**
     * 处理宏
     * @param value 当前值
     * @param configInfo C4ConfigInfo
     */
    async _processMacro(value : string, configInfo : C4ConfigInfo) {
        if (!TypeUtils.isString(value)
            || TypeUtils.isEmptyStr(value)) {
            return value;
        }

        for (let i = 0; i < configInfo.Macros.length; i++) {
            let CurMacroMark = configInfo.Macros[i];
            let MatchRes = value.match(CurMacroMark.Marco());
            if (null === MatchRes) {
                continue;
            }

            value = await CurMacroMark.Process(value, configInfo);
        }

        return value;
    }

    /**
     * 判断是否是文件引用
     * @param value 当前配置项的值
     */
    _isLink(value : string) {
        let MatchRes = value.match(/^@link:\/\/{[\s\S]+}$/g);
        if (null === MatchRes
            || MatchRes.length > 1) {
            return false;
        }

        return true;
    }
}
