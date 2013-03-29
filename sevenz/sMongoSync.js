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
// @file    : sMongoSync.js
// @create  : 13-3-28 下午2:29
//
// @brief   :
//   同步Mongodb方案
//========================================================
var Future = require('fibers/future');
var wait = Future.wait;
var mongodb = require("mongodb");

exports.defServer = null;
exports.defDbname = "";
exports.prefix = "";

/**
 * @brief 创建一个服务器连接
 * @param addr
 * @param port
 * @returns {mongodb.Server}
 */
exports.getServer = function(addr, port) {
    return new mongodb.Server(addr, port);
}

/**
 * @brief 获取一个collection
 * @param client
 * @param table
 * @returns {mongodb.Collection}
 */
exports.getCollection = function(client, table) {
    return new mongodb.Collection(client, this.prefix + table);
}

/**
 * @brief 连接数据库（实现）
 * @param server
 * @param dbname
 * @param callback
 * @private
 */
exports._connect = function(server, dbname, callback) {
    var client = new mongodb.Db(dbname, server);

    client.open(callback);
}

/**
 * @brief 连接数据库（接口）
 * @param server
 * @param dbname
 * @returns {*}
 */
exports.connect = function(server, dbname) {
    if(server === null || server === undefined)
    {
        server = this.defServer;
    }

    if(dbname === "" || dbname === undefined)
    {
        dbname = this.defDbname;
    }

    var connWrapper = Future.wrap(this._connect);

    return connWrapper(server, dbname).wait();
}

/**
 * @brief 查找函数（实现）
 * @param client
 * @param prefix
 * @param table
 * @param selector
 * @param fields
 * @param skip
 * @param limit
 * @param timeout
 * @param callback
 * @private
 */
exports._find = function(collection, selector, fields, skip, limit, timeout, callback) {
    if(selector === undefined)
    {
        collection.find().toArray(callback);
    }
    else
    if(fields === undefined)
    {
        collection.find(selector).toArray(callback);
    }
    else
    if(skip === undefined)
    {
        collection.find(selector, fields).toArray(callback);
    }
    else
    if(limit === undefined)
    {
        collection.find(selector, fields, skip).toArray(callback);
    }
    else
    if(timeout === undefined)
    {
        collection.find(selector, fields, skip, limit).toArray(callback);
    }
    else
    {
        collection.find(selector, fields, skip, limit, timeout).toArray(callback);
    }
}

/**
 * @brief 查找函数（接口）
 * @param client
 * @param table
 * @param selector
 * @param fields
 * @param skip
 * @param limit
 * @param timeout
 * @returns {*}
 */
exports.find = function(collection, selector, fields, skip, limit, timeout) {
    var findWrapper = Future.wrap(this._find);

    if(selector === undefined) return findWrapper(collection).wait();
    if(fields === undefined) return findWrapper(collection, selector).wait();
    if(skip === undefined) return findWrapper(collection, selector, fields).wait();
    if(limit === undefined) return findWrapper(collection, selector, fields, skip).wait();
    if(timeout === undefined) return findWrapper(collection, selector, fields, skip, limit).wait();
    return findWrapper(collection, selector, fields, skip, limit, timeout).wait();
}

/**
 * @brief 查找函数单个（实现）
 * @param client
 * @param prefix
 * @param table
 * @param selector
 * @param fields
 * @param skip
 * @param limit
 * @param timeout
 * @param callback
 * @private
 */
exports._findOne = function(collection, selector, fields, skip, limit, timeout, callback) {
    if(selector === undefined)
    {
        collection.findOne().toArray(callback);
    }
    else
    if(fields === undefined)
    {
        collection.findOne(selector).toArray(callback);
    }
    else
    if(skip === undefined)
    {
        collection.findOne(selector, fields).toArray(callback);
    }
    else
    if(limit === undefined)
    {
        collection.findOne(selector, fields, skip).toArray(callback);
    }
    else
    if(timeout === undefined)
    {
        collection.findOne(selector, fields, skip, limit).toArray(callback);
    }
    else
    {
        collection.findOne(selector, fields, skip, limit, timeout).toArray(callback);
    }
}

/**
 * @brief 查找函数单个（接口）
 * @param client
 * @param table
 * @param selector
 * @param fields
 * @param skip
 * @param limit
 * @param timeout
 * @returns {*}
 */
exports.findOne = function(collection, selector, fields, skip, limit, timeout) {
    var findWrapper = Future.wrap(this._findOne);

    if(selector === undefined) return findWrapper(collection).wait();
    if(fields === undefined) return findWrapper(collection, selector).wait();
    if(skip === undefined) return findWrapper(collection, selector, fields).wait();
    if(limit === undefined) return findWrapper(collection, selector, fields, skip).wait();
    if(timeout === undefined) return findWrapper(collection, selector, fields, skip, limit).wait();
    return findWrapper(collection, selector, fields, skip, limit, timeout).wait();
}

/**
 * @brief 插入数据（实现）
 * @param collection
 * @param doc
 * @param options
 * @param callback
 * @private
 */
exports._insert = function(collection, doc, options, callback) {
    collection.insert(doc, options, callback);
}

/**
 * @brief 插入数据（接口）
 * @param collection
 * @param doc
 * @param options
 * @returns {*}
 */
exports.insert = function(collection, doc, options) {
    var insertWrapper = Future.wrap(this._insert);

    if(options === undefined) options = { };
    return insertWrapper(collection, doc, options).wait();
}

/**
 * @brief 删除数据（实现）
 * @param collection
 * @param selector
 * @param options
 * @param callback
 * @private
 */
exports._remove = function(collection, selector, options, callback) {
    collection.remove(selector, options, callback);
}

/**
 * @brief 删除数据（接口）
 * @param collection
 * @param selector
 * @param options
 * @returns {*}
 */
exports.remove = function(collection, selector, options) {
    var removeWrapper = Future.wrap(this._remove);

    if(undefined === selector) selector = { };
    if(options === undefined) options = { };
    return removeWrapper(collection, selector, options).wait();
}

/**
 * @brief 重命名Collection（实现）
 * @param collection
 * @param newName
 * @param options
 * @param callback
 * @private
 */
exports._renameCollection = function(collection, newName, options, callback) {
    collection.rename(newName, options, callback);
}

/**
 * @brief 重命名Collection（接口）
 * @param collection
 * @param newName
 * @param options
 * @returns {*}
 */
exports.renameCollection = function(collection, newName, options) {
    var renameWrapper = Future.wrap(this._renameCollection);

    if(undefined === options) options = {  };
    return renameWrapper(collection, this.prefix + newName, options).wait();
}

/**
 * @brief 编辑数据（实现）
 * @param collection
 * @param doc
 * @param options
 * @param callback
 * @private
 */
exports._save = function(collection, doc, options, callback) {
    collection.save(doc, options, callback);
}

/**
 * @brief 编辑数据（接口）
 * @param collection
 * @param doc
 * @param options
 * @returns {*}
 */
exports.save = function(collection, doc, options) {
    var saveWrapper = Future.wrap(this._save);

    if(options === undefined) options = { };
    return saveWrapper(collection, doc, options).wait();
}

/**
 * @brief 更新数据（实现）
 * @param collection
 * @param selector
 * @param doc
 * @param options
 * @param callback
 * @private
 */
exports._update = function(collection, selector, doc, options, callback) {
    collection.update(selector, doc, options, callback);
}

/**
 * @brief 更新数据（接口）
 * @param collection
 * @param selector
 * @param doc
 * @param options
 * @returns {*}
 */
exports.update = function(collection, selector, doc, options) {
    var updateWrapper = Future.wrap(this._update);

    if(options === undefined) options = { };
    return updateWrapper(collection, selector, doc, options).wait();
}

exports._distinct = function(collection, key, query, options, callback) {
    collection.distinct(key, query, options, callback);
}

exports.distinct = function(collection, key, query, options) {
    var distinctWrapper = Future.wrap(this._distinct);

    if(query === undefined) query = { };
    if(options === undefined) options = { };

    return distinctWrapper(collection, key, query, options).wait();
}

exports._count = function(collection, query, options, callback) {
    collection.count(query, options, callback);
}

exports.count = function(collection, query, options) {
    var countWrapper = Future.wrap(this._count);

    if(query === undefined) query = { };
    if(options === undefined) options = { };

    return countWrapper(collection, query, options).wait();
}

exports._drop = function(collection, callback) {
    collection.drop(callback);
}

exports.drop = function(collection) {
    var dropWrapper = Future.wrap(this._drop);

    return dropWrapper(collection).wait();
}

exports._findAndModify = function(collection, query, sort, doc, options, callback) {
    collection.findAndModify(query, sort, doc, options, callback);
}

exports.findAndModify = function(collection, query, sort, doc, options) {
    var findWrapper = Future.wrap(this._findAndModify);

    if(options === undefined) options = { };
    return findWrapper(collection, query, sort, doc, options).wait();
}

exports._findAndRemove = function(collection, query, sort, options, callback) {
    collection.findAndRemove(query, sort, options, callback);
}

exports.findAndRemove = function(collection, query, sort, options) {
    var findWrapper = Future.warp(this._findAndRemove);

    if(options === undefined) options = { };
    return findWrapper(collection, query, sort, options).wait();
}

exports._createIndex = function(collection, fieldOrSpec, options, callback) {
    collection.createIndex(fieldOrSpec, options, callback);
}

exports.createIndex = function(collection, fieldOrSpec, options) {
    var cIdxWrapper = Future.wrap(this._createIndex);

    if(options === undefined) options = { };
    return cIdxWrapper(collection, fieldOrSpec, options).wait();
}

exports._ensureIndex = function(collection, fieldOrSpec, options, callback) {
    collection.ensureIndex(fieldOrSpec, options, callback);
}

exports.ensureIndex = function(collection, fieldOrSpec, options) {
    var eIdxWrapper = Future.wrap(this._ensureIndex);

    if(options === undefined) options = { };
    return eIdxWrapper(collection, fieldOrSpec, options).wait();
}

exports._indexInformation = function(collection, options, callback) {
    collection.indexInformation(options, callback);
}

exports.indexInformation = function(collection, options) {
    var iInfoWrapper = Future.wrap(this._indexInformation);

    if(options === undefined) options = { };
    return iInfoWrapper(collection, options).wait();
}

exports._dropIndex = function(collection, name, callback) {
    collection.dropIndex(name, callback);
}

exports.dropIndex = function(collection, name) {
    var dropIdxWrapper = Future.wrap(this._dropIndex);
    return dropIdxWrapper(collection, name).wait();
}

exports._dropAllIndexes = function(collection, callback) {
    collection.dropAllIndexes(callback);
}

exports.dropAllIndexes = function(collection) {
    var dAIdxWrapper = Future.wrap(this._dropAllIndexes);
    return dAIdxWrapper(collection).wait();
}

exports._reIndex = function(collection, callback) {
    collection.reIndex(callback);
}

exports.reIndex = function(collection) {
    var reidxWrapper = Future.wrap(this._reIndex);
    return reidxWrapper(collection).wait();
}

/**
 *
 * @TODO: mapReduce, group, options, isCapped, indexExists, geoNear,
 *        geoHaystackSearch, indexes, aggregate, stats
 *
 */