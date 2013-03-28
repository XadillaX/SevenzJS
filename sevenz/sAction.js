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
// @file    : sAction.js
// @create  : 13-3-26 下午1:49
//
// @brief   :
//   Action模块，其实就是控制器模块的一些经常需要调用的函数和变量
//========================================================
var http = require("http");
var querystring = require("querystring");
var url = require("url");

/**
 * 生成action helper对象
 * @param request
 * @param response
 * @param pathinfo
 * @param conf
 * @param logger
 * @param postData
 */
exports.sAction = function(request, response, pathinfo, conf, logger, postData) {
    this.status = 200;                  ///< 状态码
    this.contentType = "text/html";     ///< 文档类型
    this.head = { };                    ///< 头信息
    this.response = response;           ///< response实例
    this.request = request;             ///< request实例
    this.content = "";                  ///< 输出内容
    this.pathinfo = pathinfo;           ///< pathinfo数组
    this.conf = conf;                   ///< 配置信息
    this.logger = logger;               ///< Logger
    this.GET = querystring.parse(url.parse(request.url).query); ///< GET信息
    this.POST = querystring.parse(postData);                    ///< POST信息

    var serverInfoTemp = require("./sRequest");
    this.serverInfo = new serverInfoTemp.sRequest(this.request);

    /** Mongodb相关初始化 */
    this.mongodb = null;
    if(conf["mongodb"] !== undefined)
    {
        /**
         * 创建MongoDB
         * @type {*}
         */
        this.mongodb = require("./sMongoSync");

        /**
         * 创建服务器对象
         */
        if(undefined !== conf["mongodb"]["addr"] && undefined !== conf["mongodb"]["port"])
        {
            var serv = this.mongodb.getServer(conf["mongodb"]["addr"], conf["mongodb"]["port"]);
            this.mongodb.defServer = serv;
        }

        /**
         * 设置默认数据库
         */
        if(undefined !== conf["mongodb"]["database"])
        {
            this.mongodb.defDbname = conf["mongodb"]["database"];
        }

        /**
         * 设置表前缀
         */
        if(undefined !== conf["mongodb"]["prefix"])
        {
            this.mongodb.prefix = conf["mongodb"]["prefix"];
        }
    }
}

/**
 * @brief 设置状态码
 * @param status
 */
exports.sAction.prototype.setStatus = function(status) {
    this.status = status;
};

/**
 * @brief 获取状态码
 * @returns {number}
 */
exports.sAction.prototype.getStatus = function() { return this.status; };

/**
 * @brief 设置文档类型
 * @param type
 */
exports.sAction.prototype.setContentType = function(type) {
    this.contentType = type;
};

/**
 * @brief 返回状态类型
 * @returns {string}
 */
exports.sAction.prototype.getContentType = function() { return this.contentType; };

/**
 * @brief 设置头
 * @param heads
 */
exports.sAction.prototype.setHeads = function(heads) {
    this.head = heads;
};

/**
 * @brief 返回头
 * @returns {*}
 */
exports.sAction.prototype.getHeads = function() { return this.head; };

/**
 * @brief 追加输出
 * @param content
 */
exports.sAction.prototype.write = function(content) {
    this.content += content;
};

/**
 * 清空缓冲区
 */
exports.sAction.prototype.cleanContent = function() {
    this.content = "";
};

/**
 * 渲染输出
 * @private
 */
exports.sAction.prototype._render = function() {
    var h = this.head;
    h["Content-Type"] = this.contentType;

    this.response.writeHead(this.status, h);
    this.response.write(this.content);
    this.response.end();
};

/**
 * @brief 是否是POST页面
 * @returns {boolean}
 */
exports.sAction.prototype.isPost = function() {
    return this.sAction.request.method === "POST";
}

/**
 * @brief 是否是GET页面
 * @returns {boolean}
 */
exports.sAction.prototype.isGet = function() {
    return this.sAction.request.method === "GET";
}

/**
 * 设置404页面
 * @param content
 */
exports.sAction.prototype.set404 = function(content) {
    this.setStatus(404);
    this.cleanContent();
    this.write("<html><head><title>Error 404</title></head><body>")
    this.write("<h1>ヽ(≧Д≦)ノOops! Error 404!</h1>");
    this.write("It means you visited a page that not exists. Please contact the web administrator [<a href='mailto:" + this.conf["server"]["adminemail"] +"'>" + this.conf["server"]["adminemail"] + "</a>]. Thank you. <br />");
    if(content !== undefined && content !== "") this.write("<pre style='margin: 15px; padding: 15px; border: 1px solid #ccc; background-color: #f8f8f8; border-radius: 3px;'>" + content + "</pre>")
    this.write("<hr />");
    this.write("<div style='text-align: right;'>Powered by SevenzJS. <small style='color: #ccc;'>A light weighted Node.JS framework.</small></div>");
    this.write("</body></html>")

    this._render();
}
