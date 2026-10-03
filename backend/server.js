const http = require('http');
const net = require('net');

const PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 3275);
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);

function checkDatabase() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: DB_HOST, port: DB_PORT });
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 1500);

    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.end();
      resolve(true);
    });
    socket.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/health') {
    const databaseReachable = await checkDatabase();
    const body = JSON.stringify({
      status: 'ok',
      databaseReachable,
      timestamp: new Date().toISOString()
    });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(body);
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    const body = JSON.stringify({ error: 'Not found' });
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(body);
    return;
  }

  res.writeHead(204);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Markdown Notebook backend running on port ${PORT}`);
});
