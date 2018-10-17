import C4Configger from "./C4Configger";
import C4AJV from "c4ajv";

let CurConfigger : C4Configger;

async function Launch() {
    let Checker = new C4AJV();
    await Checker.init('./Schema');
    CurConfigger = new C4Configger({
        AppName : "app-server",
        Version : "0.0.1",
        host : "localhost",
        port : 9001,
        InstanceID : '123',
        Profiles : "staging",
        Checker : Checker,
        Label : "test-tag10"
    });

    await CurConfigger.init();
    await CurConfigger.load();

    console.log(JSON.stringify(C4Configger.g_Config, null, 4));
}


Launch().catch((err) => {
    console.log(err);
});
