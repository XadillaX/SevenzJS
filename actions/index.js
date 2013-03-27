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
    var sAction = action;

    self["index"] = function() {
        sAction.write("Hello world!");
        sAction.write("<hr />")
        sAction.write("服务端：" + sAction.serverInfo.serverAddr + ":" + sAction.serverInfo.serverPort);
        sAction.write("<br />")
        sAction.write("客户端：" + sAction.serverInfo.clientAddr + ":" + sAction.serverInfo.clientPort);

        var outItem = "aaa";
        sAction.mongodb.connect(function(err, db){
            if(err)
            {
                sAction.mongodb.close();
                sAction.set404(err);
                return;
            }

            db.collection("7z_admin", function(err, collection){
                if(err)
                {
                    sAction.mongodb.close();
                    sAction.set404(err);
                    return;
                }

                collection.findOne({ "adminname" : "XadillaX" }, function(err, item){
                    if(err)
                    {
                        sAction.mongodb.close();
                        sAction.set404(err);
                        return;
                    }

                    outItem = item;
                    console.log(outItem);
                });
            });

            /** TODO: Mongodb一团糟——要是是同步就好了。 */
        });
    }

    return self;
};
