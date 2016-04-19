"use strict"

var BrowserMongoDBServer = require('browser-mongodb').Server,
  SocketIOTransport = require('browser-mongodb').SocketIOTransport;

class Server {
  constructor(db, options) {
    this.db = db;
    this.options = options || {};
  }

  connect(httpServer) {
    var self = this;
    // Create the browser server
    this.server = new BrowserMongoDBServer(this.db, this.options);
    // Add a socket transport
    this.server.registerHandler(new SocketIOTransport(httpServer));
    // Get the channel
    this.channel = this.server.channel('mongodb');

    // Add a before handler
    this.channel.before(function(conn, channel, data, callback) {
      callback();
    });

    // Return a promise
    return new Promise((resolve, reject) => {
      resolve(self);
    });
  }

  destroy() {
    var self = this;

    return new Promise((resolve, reject) => {
      self.server.destroy();
      resolve();
    });
  }
}

module.exports = Server;
