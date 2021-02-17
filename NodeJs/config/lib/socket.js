const _ = require('lodash'),
    expressLib = require('./express');
exports.sendMessageToAllSockets = (msg, data) => {
    const sockets = expressLib.getAllConnectedSockets();
    _.map (sockets, (socket) => {
        socket.emit(msg, { data });
    })
}