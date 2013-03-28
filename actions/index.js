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
// @create  : 13-3-26 下午8:32
//
// @brief   :
//   Demo首页。
//========================================================
exports.action = function(action) {
    var self = { };
    var helper = action;

    self["index"] = function() {
        var client = helper.mongodb.connect();
        var collection = helper.mongodb.getCollection(client, "admin");

        /** 更新 */
        var result = helper.mongodb.update(
            collection,
            { "adminname" : "XadillaX" },
            { $set : { "adminname" : "XadillaX1" } },
            { w : 1 }
        );
        helper.write(result);

        client.close();
    }

    return self;
};
