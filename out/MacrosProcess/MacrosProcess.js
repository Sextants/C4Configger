"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crypto = require("crypto");
const Moment = require("moment");
const uuidv4 = require("uuid/v4");
exports.default = {
    "{AppName}": {
        Marco: () => {
            return new RegExp('{AppName}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{AppName}/g, configInfo.AppName);
        }
    },
    "{Version}": {
        Marco: () => {
            return new RegExp('{Version}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{Version}/g, configInfo.Version);
        }
    },
    "{InstanceID}": {
        Marco: () => {
            return new RegExp('{InstanceID}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{InstanceID}/g, configInfo.InstanceID);
        }
    },
    "{host}": {
        Marco: () => {
            return new RegExp('{host}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{host}/g, configInfo.host);
        }
    },
    "{port}": {
        Marco: () => {
            return new RegExp('{port}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{port}/g, configInfo.port + '');
        }
    },
    // 替换为随机数的SHA1值
    "{Random.Hash}": {
        Marco: () => {
            return new RegExp('{Random.Hash}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{Random.Hash}/g, (key) => {
                let CurHash = Crypto.createHash('sha1');
                CurHash.update(Math.random() + '');
                let Hash = CurHash.digest('hex');
                return Hash;
            });
        }
    },
    // 替换为0~4294967295之间的随机整数
    "{Random.Int}": {
        Marco: () => {
            return new RegExp('{Random.Int}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{Random.Int}/g, (key) => {
                let CurInt = parseInt((Math.random() * 4294967295) + '');
                return CurInt + '';
            });
        }
    },
    // 替换为0~1之间的随机浮点数
    "{Random}": {
        Marco: () => {
            return new RegExp('{Random}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{Random}/g, (key) => {
                let CurNum = Math.random();
                return CurNum + '';
            });
        }
    },
    // 替换为随机值的MD5值
    "{Random.HashEx}": {
        Marco: () => {
            return new RegExp('{Random.HashEx}', 'g');
        },
        Process: function (value, configInfo) {
            let CurHash = Crypto.createHash('md5');
            CurHash.update(Math.random() + '');
            let Hash = CurHash.digest('hex');
            return value.replace(/{Random.HashEx}/g, Hash);
        }
    },
    // 替换为-2147483648~2147483647之间的随机整数值
    "{Random.IntEx}": {
        Marco: () => {
            return new RegExp('{Random.IntEx}', 'g');
        },
        Process: function (value, configInfo) {
            let CurInt = parseInt((Math.random() * 4294967295 - 2147483648) + '') + '';
            return value.replace(/{Random.IntEx}/g, CurInt);
        }
    },
    // 替换为-1~1之间的随机浮点数
    "{RandomEx}": {
        Marco: () => {
            return new RegExp('{RandomEx}', 'g');
        },
        Process: function (value, configInfo) {
            let CurNum = Math.random() * 2 - 1 + '';
            return value.replace(/{RandomEx}/g, CurNum);
        }
    },
    // 替换为1970年1月1日至今的毫秒数
    "{timestamp}": {
        Marco: () => {
            return new RegExp('{timestamp}', 'g');
        },
        Process: function (value, configInfo) {
            return value.replace(/{timestamp}/g, (key) => {
                let CurTime = (new Date()).getTime();
                return CurTime + '';
            });
        }
    },
    // 替换为ISO 8601字符串
    '{timestampEx}': {
        Marco: () => {
            return new RegExp('{timestampEx}', 'g');
        },
        Process: function (value, configInfo) {
            let CurTime = Moment().toISOString();
            return value.replace(/{timestampEx}/g, CurTime);
        }
    },
    // 替换为uuid v4的值
    '{uuid}': {
        Marco: () => {
            return new RegExp('{uuid}', 'g');
        },
        Process: function (value, configInfo) {
            let CurValue = uuidv4();
            return value.replace(/{uuid}/g, CurValue);
        }
    }
};
//# sourceMappingURL=MacrosProcess.js.map