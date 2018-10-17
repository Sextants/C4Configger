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
class C4BaseLoader {
    constructor() { }
    init() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * 处理宏
     * @param value 当前值
     * @param configInfo C4ConfigInfo
     */
    _processMacro(value, configInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!c4utils_1.TypeUtils.isString(value)
                || c4utils_1.TypeUtils.isEmptyStr(value)) {
                return value;
            }
            for (let i = 0; i < configInfo.Macros.length; i++) {
                let CurMacroMark = configInfo.Macros[i];
                let MatchRes = value.match(CurMacroMark.Marco());
                if (null === MatchRes) {
                    continue;
                }
                value = yield CurMacroMark.Process(value, configInfo);
            }
            return value;
        });
    }
    /**
     * 判断是否是文件引用
     * @param value 当前配置项的值
     */
    _isLink(value) {
        let MatchRes = value.match(/^@link:\/\/{[\s\S]+}$/g);
        if (null === MatchRes
            || MatchRes.length > 1) {
            return false;
        }
        return true;
    }
}
exports.default = C4BaseLoader;
//# sourceMappingURL=C4BaseLoader.js.map