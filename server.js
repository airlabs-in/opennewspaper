const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 3001);
const root = __dirname;
const publicFiles = new Set([
  "index.html",
  "content.json",
  "styles.css",
  "lead_photo.jpg",
  "images/market-floor.jpg",
  "images/diplomatic-talks.jpg",
  "images/library-opening.jpg",
]);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  if (!publicFiles.has(relativePath)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  const filePath = path.join(root, relativePath);

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(contents);
  });
}).listen(port, host, () => {
  console.log(`Daily Chronicle running at http://${host}:${port}`);
});
