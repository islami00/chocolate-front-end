#!/usr/bin/env node
/**
 * Module dependencies.
 */

import deb from 'debug';
import http from 'http';
import { AddressInfo } from 'net';
import app from '../app';
import * as gcdbg from "@google-cloud/debug-agent";
import { gConnect, isGconnect } from '../config';

const debug = deb('auth-server:server');

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const scopedPort = parseInt(val, 10);

  if (Number.isNaN(scopedPort)) {
    // named pipe
    return val;
  }

  if (scopedPort >= 0) {
    // port number
    return scopedPort;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(addr: string | AddressInfo | null) {
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    // eslint-disable-next-line no-fallthrough
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    // eslint-disable-next-line no-fallthrough
    default:
      throw error;
  }
}

const main = async function () {
  if (isGconnect){
     await gConnect();
  }
  debug(`IsGconnect: ${isGconnect}`);
  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => onListening(server.address()));
};

main();