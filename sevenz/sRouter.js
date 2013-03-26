/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 13-3-26
 * Time: 下午3:48
 * 路由相关
 */
require("./utils/json2");

exports.isValidClassString = function(str) {
    for(var i = 0; i < str.length; i++)
    {
        if(str[i] >= 'a' && str[i] <= 'z') continue;
        if(str[i] >= 'A' && str[i] <= 'Z') continue;
        if(str[i] >= '0' && str[i] <= '9') continue;
        if(str[i] == '-' || str[i] == '_') continue;

        return false;
    }

    return true;
}
exports.logger = null;
exports.conf = null;
exports.fs = require("fs");

/**
 * 路由处理函数
 * @param cls       Action信息
 * @param func      Action函数
 * @param request   request信息
 * @param response  response信息
 * @param pathinfo  URI信息
 * @private
 */
exports._view = function(cls, func, request, response, pathinfo) {
    this.logger.info("Routing to '" + cls + "' - '" + func + "'...");

    /** 实例化action对象 */
    var rAction = require("./sAction");
    var action = new rAction.sAction(request, response, pathinfo, this.conf);

    /** 判断Action合法性 */
    if(this.isValidClassString(cls))
    {
        var filename = "../actions/" + cls;
        var actionObj = null;

        /** 载入Action模块 */
        try {
            var actionObj = require(filename);
        }
        catch(e) {
            this.logger.error(e);
            if(this.conf["server"]["debug"] === true) action.set404(e);
            else action.set404();
            return;
        }

        /** Action错误 */
        if(actionObj === undefined || typeof actionObj.action !== "function")
        {
            this.logger.error("Broken action object '" + cls + "'.");

            if(this.conf["server"]["debug"] === true) action.set404("Broken action object '" + cls + "'.");
            else action.set404();
            return;
        }

        /** Action路由错误 */
        var routeTable = actionObj.action(action);
        if(routeTable === undefined || typeof routeTable !== "object")
        {
            this.logger.error("Broken action router '" + cls + "'.");

            if(this.conf["server"]["debug"] === true) action.set404("Broken action router '" + cls + "'.");
            else action.set404();
            return;
        }

        /** 操作名错误 */
        if(routeTable[func] === undefined || typeof routeTable[func] !== "function")
        {
            this.logger.error("No suct action function '" + func + "' @ '" + cls + "'.");

            if(this.conf["server"]["debug"] === true) action.set404("No suct action function '" + func + "' @ '" + cls + "'.");
            else action.set404();
            return;
        }

        /** 执行函数 */
        routeTable[func]();
        action._render();
    }
    else
    {
        this.logger.error("Error action name '" + cls + "'");
        if(this.conf["server"]["debug"] === true) action.set404("Error action name '" + cls + "'");
        else action.set404();
    }
}

/**
 * 路由入口函数
 * @param pathinfo URI数组信息
 * @param request request信息
 * @param response response信息
 */
exports.route = function(pathinfo, request, response) {
    var act = pathinfo[0];
    var func = pathinfo[1];
    if(act === undefined || act === "") act = "index";
    if(func === undefined || func === "") func = "index";

    this._view(act.toLowerCase(), func.toLowerCase(), request, response, pathinfo);
}
