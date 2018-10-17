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
const StripJsonComments = require("strip-json-comments");
const c4utils_1 = require("c4utils");
const C4ConfigLoaderInterface_1 = require("./C4ConfigLoaderInterface");
class C4JSONLoader extends C4ConfigLoaderInterface_1.default {
    init(initString) {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
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
            let doc = null;
            try {
                let fileData = yield c4utils_1.FSP.ReadFile(loadString, {
                    flag: 'r',
                    encoding: 'utf8'
                });
                doc = JSON.parse(StripJsonComments(fileData));
                return doc;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = C4JSONLoader;
//# sourceMappingURL=C4JSONLoader.js.map