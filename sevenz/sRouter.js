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
// @file    : sRouter.js
// @create  : 13-3-26 下午3:48
//
// @brief   :
//   路由相关模块
//========================================================
require("./utils/json2");

/**
 * @brief 判断是否是合法的类名
 * @param str
 * @returns {boolean} 是否合法
 */
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

/**
 * @brief logger实例
 */
exports.logger = null;

/**
 * @brief 配置信息}
 */
exports.conf = null;

/**
 * 文件系统模块
 */
exports.fs = require("fs");

/**
 * @brief 路由处理函数
 * @param cls
 * @param func
 * @param request
 * @param response
 * @param pathinfo
 * @param postData
 * @private
 */
exports._view = function(cls, func, request, response, pathinfo, postData) {
    this.logger.info("Routing to '" + cls + "' - '" + func + "'...");

    /** 实例化action对象 */
    var rAction = require("./sAction");
    var action = new rAction.sAction(request, response, pathinfo, this.conf, this.logger, postData);

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
        var Fiber = require('fibers');

        Fiber(function(){
            routeTable[func]();
            action._render();
        }).run();
    }
    else
    {
        this.logger.error("Error action name '" + cls + "'");
        if(this.conf["server"]["debug"] === true) action.set404("Error action name '" + cls + "'");
        else action.set404();
    }
}

/**
 * @brief 路由入口函数
 * @param pathinfo  URI数组信息
 * @param request   request信息
 * @param response  response信息
 */
exports.route = function(pathinfo, postData, request, response) {
    /** 去除后缀 */
    if(pathinfo.length > 0)
    {
        var lastParam = pathinfo[pathinfo.length - 1];
        var suffCount = this.conf["server"]["suffix"].length;
        var suffs = this.conf["server"]["suffix"];

        for(var i = 0; i < suffCount; i++)
        {
            /**
             * substr: start, length
             */
            if(lastParam.substr(lastParam.length - suffs[i].length, suffs[i].length).toLowerCase() == suffs[i].toLowerCase())
            {
                /**
                 * substring: start, end
                 * @type {string}
                 */
                lastParam = lastParam.substring(0, lastParam.length - suffs[i].length);
                pathinfo[pathinfo.length - 1] = lastParam;
                break;
            }
        }
    }

    /** 解析Action以及其func */
    var act = pathinfo[0];
    var func = pathinfo[1];
    if(act === undefined || act === "") act = "index";
    if(func === undefined || func === "") func = "index";

    this._view(act.toLowerCase(), func.toLowerCase(), request, response, pathinfo, postData);
}
