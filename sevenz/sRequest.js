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
// @file    : sRequest.js
// @create  : 13-3-27 下午3:52
//
// @brief   :
//   存服务端和客户端的一些信息
//========================================================
exports.sRequest = function(request) {
    this.serverAddr = request.socket.address()["address"];
    this.serverPort = request.socket.address()["port"];

    this.clientAddr = request.socket.remoteAddress;
    this.clientPort = request.socket.remotePort;

    this.method = request.method;
}
