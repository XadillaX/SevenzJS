/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 13-3-26
 * Time: 下午8:32
 * Hello world
 */
exports.action = function(action) {
    var self = { };
    var sAction = action;

    self["index"] = function() {
        sAction.write("Hello world!");
    }

    return self;
}