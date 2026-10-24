import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleChatRequest, loadEnvironment } from './server/geminiService.js';

loadEnvironment();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // Route /api/chat to Gemini handler
  if (req.url === '/api/chat' || req.url?.startsWith('/api/chat?')) {
    return handleChatRequest(req, res);
  }

  // Health check endpoint
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', service: 'welfora-backend' }));
  }

  // Serve static files from dist/ if available
  const safeUrl = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(DIST_DIR, safeUrl === '/' ? 'index.html' : safeUrl);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Fallback to index.html for SPA client-side routing
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Welfora standalone server running. Run `npm run build` to generate static frontend files, or use `npm run dev` for local development.');
});

server.listen(PORT, () => {
  console.log(`Welfora server running on http://localhost:${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/chat`);
});
