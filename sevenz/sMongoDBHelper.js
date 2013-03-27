//========================================================
//         ______________________________________
// ________|                                      |_______
// \       | SevenzJS :                           |      /
//  \      |   A light weighted Node.JS framework |     /
//  /      |______________________________________|     \
// /__________)                                (_________\
//
// @author  : xadillax
//
// @file    : sMongoDBHelper.js
// @create  : 13-3-27 下午4:21
//
// @brief   :
//   MongoDB助手类。依赖于mongoose。
//========================================================
exports.mongodb = require("mongodb");
exports.mongodbServer = null;

exports.defDatabase = "";
exports.serverAddr = "";
exports.serverPort = "";
exports.prefix = "";
exports.curConnect = null;

exports.setConnect = function(conf) {
    this.serverAddr = conf["addr"];
    this.serverPort = conf["port"];
    this.defDatabase = conf["database"];
    this.prefix = conf["prefix"];

    this.mongodbServer = new this.mongodb.Server(
        this.serverAddr,
        this.serverPort
    );
}

exports.connect = function(callback, database) {
    if(database === "" || database === undefined) database = this.defDatabase;

    this.curConnect = new this.mongodb.Db(database, this.mongodbServer);
    this.curConnect.open(callback);
}

exports.close = function() {
    this.curConnect.close();
}
