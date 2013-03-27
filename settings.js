/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 13-3-26
 * Time: 下午8:26
 * 配置信息
 */
var settings = {
    /** 服务器基础信息 */
    "server"    : {
        "port"      : 5555,
        "adminemail": "admin@xcoder.in",
        "statics"   : "/home/xadillax/node.js/szjs/statics/",
        "suffix"    : [
            ".html", ".xhtml", ".do", ".szjs"
        ]
    },

    /** MySQL信息 */
    "mysql"     : {
        "addr"      : "127.0.0.1",
        "port"      : 3306,
        "database"  : "7zcar",
        "username"  : "root",
        "password"  : "deathmoon",
        "prefix"    : "7z_"
    },

    /** MongoDB信息 */
    "mongodb"   : {
        "addr"      : "localhost",
        "port"      : 27017,
        "database"  : "7zcar",
        "prefix"    : "7z_"
    }
};

exports.settings = settings;