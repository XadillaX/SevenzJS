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
// @file    : sMysql.js
// @create  : 13-3-29 下午2:00
//
// @brief   :
//   Mysql helper.
//========================================================
function sMysql()
{
    this.mysql = require("mysql-libmysqlclient");
    this.addr = "localhost";
    this.port = 3306;
    this.dbname = "sevenz";
    this.username = "root";
    this.password = "";
    this.prefix = "";
    this.charset = "utf8";
    this.conn = null;

    this.lastError = "";

    /**
     * 连接数据库
     * @param addr
     * @param port
     * @param username
     * @param password
     * @param dbname
     * @param charset
     * @returns {*}
     */
    this.connect = function(addr, port, username, password, dbname, charset) {
        if(this.conn !== null) {
            this.disconnect(this.conn);
            this.conn = null;
        }

        if(addr === undefined) addr = this.addr;
        if(port === undefined) port = this.port;                ///< ?
        if(username === undefined) username = this.username;
        if(password === undefined) password = this.password;
        if(dbname === undefined) dbname = this.dbname;
        if(charset === undefined) charset = this.charset;

        var conn = this.mysql.createConnectionSync();
        conn.connectSync(addr, username, password, dbname, port);

        if(!conn.connectedSync())
        {
            this.lastError("Error " + conn.connectErrno + ": " + conn.connectError);
            return false;
        }

        if(charset !== undefined) conn.setCharsetSync(charset);

        this.conn = conn;
        return conn;
    }

    /**
     * 关闭连接
     * @param conn
     */
    this.disconnect = function(conn) {
        if(conn === undefined) conn = this.conn;
        if(conn === null) return;

        conn.closeSync();
    }

    /**
     * 高级查询数据
     * @param query
     * @param conn
     */
    this.query = function(query, conn) {
        if(conn === undefined) conn = this.conn;
        if(conn === null) return false;

        var result = conn.querySync(query);

        /** TODO: 哪位大神能帮忙获取查询错误信息？ */
        if(typeof result !== "object")
        {
            return false;
        }

        var rows = result.fetchAllSync();
        return rows;
    }

    /**
     * 低级查询数据
     * @param query
     * @param conn
     * @returns {*}
     */
    this.realQuery = function(query, conn) {
        if(conn === undefined) conn = this.conn;
        if(conn === null) return false;

        conn.realQuerySync(query);
        var result = conn.storeResultSync();

        /** TODO: 哪位大神能帮忙获取查询错误信息？ */
        if(typeof result !== "object") {
            return false;
        }

        var outResult = [ ];
        while((row = result.fetchRowSync({ "asArray": true })))
        {
            outResult.push(row);
        }

        result.freeSync();

        return outResult;
    }

    /**
     * 获取连接信息
     * @param conn
     * @returns {*}
     */
    this.getInfo = function(conn) {
        if(conn === undefined) conn = this.conn;
        if(conn === null) return false;

        return conn.getInfoSync();
    }
}

module.exports = sMysql;
