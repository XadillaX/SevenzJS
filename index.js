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
// @file    : index.js
// @create  : 13-3-26 下午3:13
//
// @brief   :
//   Demo入口
//========================================================
var sevenz = require("./sevenz/SevenzJS");
var conf = require("./settings").settings;

/** 启动服务 */
sevenz.server(conf).startServer();
