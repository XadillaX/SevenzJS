var sevenz = require("./sevenz/SevenzJS");
var conf = require("./settings").settings;

/** 启动服务 */
sevenz.server(conf).startServer();
