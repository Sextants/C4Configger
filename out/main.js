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
const C4Configger_1 = require("./C4Configger");
const c4ajv_1 = require("c4ajv");
let CurConfigger;
function Launch() {
    return __awaiter(this, void 0, void 0, function* () {
        let Checker = new c4ajv_1.default();
        yield Checker.init('./Schema');
        CurConfigger = new C4Configger_1.default({
            AppName: "app-server",
            Version: "0.0.1",
            host: "localhost",
            port: 9001,
            InstanceID: '123',
            Profiles: "staging",
            Checker: Checker,
            Label: "test-tag10"
        });
        yield CurConfigger.init();
        yield CurConfigger.load();
        console.log(JSON.stringify(C4Configger_1.default.g_Config, null, 4));
    });
}
Launch().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=main.js.map