require("./utils/json2");
var fs = require("fs");
var log = require("./utils/log");
var logger = log.create();

/**
 * 合并配置信息
 * @param org 原配置
 * @param opt 扩展配置
 * @returns {*}
 * @private
 */
function _mergeConf(org, opt) {
    var result = org;
    if(undefined !== opt["server"])
    {
        for(var obj in opt["server"])
        {
            result["server"][obj] = opt["server"][obj];
        }
    }
    if(undefined !== opt["mysql"])
    {
        result["mysql"] = opt["mysql"];
    }
    if(undefined !== opt["mongodb"])
    {
        result["mongodb"] = opt["mongodb"];
    }

    /** 扩展信息 */
    if(undefined !== opt["ext"])
    {
        result["ext"] = opt["ext"];
    }

    return result;
}

exports.server = function(options) {
    var http = require("http");
    var url = require("url");
    var path = require("path");
    var self = { };             ///< 成员函数

    /**
     * 一堆默认配置信息
     * @type {{port: number}}
     */
    var conf = {
        "server"    : {
            "port"      : 80,
            "debug"     : true,
            "adminemail": "administrator@yourdomain.com"
        }
    };

    /** 合并配置信息 */
    conf = _mergeConf(conf, options);

    /**
     * 尝试打开静态文件（非Node.JS运算得出）
     * @param pathname 文件路径
     * @param request request信息
     * @param response response信息
     * @returns {boolean}
     */
    self.tryStatics = function(pathname, request, response) {
        /** 看看有没有设置 */
        if(conf["server"]["statics"] === undefined) return false;

        /** 判断pathname合法性 */
        if(pathname[0] == '/' || pathname[0] == '\\') return false;
        if(pathname[pathname.length - 1] == '/' || pathname[pathname.length - 1] == '\\') return false;
        for(var i = 2; i < pathname.length - 1; i++)
        {
            if(pathname[i - 2] === '.' && pathname[i - 1] && (pathname[i] == '\\' || pathname[i] == '/')) return false;
        }
        if("" === pathname) return false;

        /** 打开文件 */
        var filename = conf["server"]["statics"] + pathname;
        if(!fs.existsSync(filename)) return false;

        var file = null;
        try {
            file = fs.readFileSync(filename, "binary");
        }
        catch(err) {
            logger.error("Can't open static file '" + filename + "'.\n" + err);
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write("Error!");
            response.end();

            return true;
        }

        var mime = require("./utils/mime");
        var ext = path.extname(filename);
        ext = ext ? ext.slice(1) : 'unknown';

        var contentType = mime[ext] || "text/plain";
        response.writeHead(200, { 'Content-Type': contentType });
        response.write(file, "binary");
        response.end();

        logger.info("Fetched a statics file from '" + pathname + "'.");

        return true;
    }

    /** 开启服务 */
    self.startServer = function() {
        logger.info("Starting SevenzJS Server...");

        http.createServer(function(request, response){
            /** 解析PATHNAME */
            var pathname = url.parse(request.url).pathname;
            if(pathname[0] === '/') pathname = pathname.substr(1);
            var urlArray = pathname.split("/");

            logger.info("Received a request @ '" + pathname + "'.");

            /** 看看是否在静态文件区内 */
            if(self.tryStatics(pathname, request, response)) return;

            /** 处理路由信息 */
            var router = require("./sRouter");
            router.logger = logger;
            router.conf = conf;
            router.route(urlArray, request, response);
        }).listen(conf["server"]["port"]);

        logger.info("Started.");
    }

    return self;
};
