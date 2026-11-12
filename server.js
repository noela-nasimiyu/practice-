const http = require("node:http");
const { readFile } = require("node:fs");
const path = require("node:path");

const pagePath = path.join(__dirname, "index.html");
const port = Number(process.env.PORT) || 3000;

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url || "/", "http://localhost").pathname;

  if (pathname !== "/" && pathname !== "/index.html") {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method not allowed");
    return;
  }

  readFile(pagePath, (error, content) => {
    if (error) {
      console.error("Could not read index.html:", error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": content.length,
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Balozi gallery running at http://127.0.0.1:${port}`);
});
