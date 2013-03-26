/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 13-3-26
 * Time: 下午1:49
 * 控制器相关函数
 */
var http = require("http");

exports.sAction = function(request, response, pathinfo, conf) {
    this.status = 200;                  ///< 状态码
    this.contentType = "text/html";     ///< 文档类型
    this.head = { };                    ///< 头信息
    this.response = response;           ///< response实例
    this.request = request;
    this.content = "";                  ///< 输出内容
    this.pathinfo = pathinfo;
    this.conf = conf;
}

/**
 * 设置状态码
 * @param status
 */
exports.sAction.prototype.setStatus = function(status) {
    this.status = status;
};

/**
 * 获取状态码
 * @returns {number}
 */
exports.sAction.prototype.getStatus = function() { return this.status; };

/**
 * 设置文档类型
 * @param type
 */
exports.sAction.prototype.setContentType = function(type) {
    this.contentType = type;
};

/**
 * 返回状态类型
 * @returns {string}
 */
exports.sAction.prototype.getContentType = function() { return this.contentType; };

/**
 * 设置头
 * @param heads
 */
exports.sAction.prototype.setHeads = function(heads) {
    this.head = heads;
};

/**
 * 返回头
 * @returns {*}
 */
exports.sAction.prototype.getHeads = function() { return this.head; };

/**
 * 追加输出
 * @param content
 */
exports.sAction.prototype.write = function(content) {
    this.content += content;
};

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
