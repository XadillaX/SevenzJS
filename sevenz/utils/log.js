var fs = require('fs');

var cwd = process.cwd() + '/',
INFO = 0;
DEBUG = 1;
WARNING = 2;
ERROR = 3;
TRACE = 4;
INIT = 6;
type = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'TRACE', '', 'LOG_INIT'];
colors = [38, 34, 35, 31, 32, 36, 33];
bufferSize = 20000;
writeSize = 16384;

exports.INFO = INFO;
exports.DEBUG = DEBUG;
exports.WARNING = WARNING;
exports.ERROR = ERROR;
exports.TRACE = TRACE;


function getPos() {
    try {
        throw new Error();
    } catch(e) {
        var pos = e.stack.split('\n')[4].split('(')[1].split(')')[0].split(':');
        return pos[0].replace(cwd, '') + ':' + pos[1];
    }
}

function pad2(num) {
    return num > 9 ? num : '0' + num;
}

function getTime() {
    var t = new Date();
    return [t.getFullYear(), '-', pad2(t.getMonth() + 1) , '-', pad2(t.getDate()), ' ',
        pad2(t.getHours()), ':', pad2(t.getMinutes()), ':', pad2(t.getSeconds())].join('');
}

function formatLog(log, color) {
    var tag = head = foot = '';
    if (color) {
        head = '\x1B[';
        foot = '\x1B[0m';
        tag = colors[5]+'m';
        color = colors[log.type]+'m';
    }

    return [log.time, ' [', head, color, type[log.type], foot, '] [', head, tag, log.pos, foot, '] ', log.msg].join('');
}

exports.create = function(level, file) {
    if (!level) {
        level = INFO;
    }
    if (file) {
        var buffer = new Buffer(bufferSize);
        var pos = 0;
        var fd = fs.openSync(file, 'a');
        process.on('exit', function(){
            fs.writeSync(fd, buffer, 0, pos, null);
        })
    }

    function log(type, msg) {
        if (type < level){
            return;
        }
        var log = {type:type, msg:msg, time:getTime(), pos:getPos()};
        console.log(formatLog(log, true));
        if (file) {
            if (pos >= writeSize) {
                fs.writeSync(fd, buffer, 0, pos, null);
                pos = 0;
            }
            pos += buffer.write(formatLog(log) + "\r\n", pos);
        }
    }

    if(file) console.log(formatLog({type:INIT, pos:file, time:getTime(), msg: 'log init with level ' + type[level]}, true));
    else {
        console.log(formatLog({type:INIT, pos:"CONSOLE", time:getTime(), msg: 'log init with level ' + type[level]}, true));
    }

    return {
        info : function(msg) {log(INFO, msg);},
        debug : function(msg) {log(DEBUG, msg);},
        warning : function(msg) {log(WARNING, msg);},
        error : function(msg) {log(ERROR, msg);},
        trace : function(msg) {log(TRACE, msg);},
    };
}
