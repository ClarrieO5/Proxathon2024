import express from "express";
import http from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import chalk from "chalk";
import { hostname } from "node:os";
import cors from "cors";
import path from "node:path"
import wisp from "wisp-server-node";

var theme = chalk.hex("#00FF7F");
var host = chalk.hex("0d52bd");

const server = http.createServer();
const app = express(server);
const __dirname = process.cwd();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
app.use(cors());

app.use((req, res) => {
    res.status(404);
    res.sendFile(path.join(process.cwd(), "/public/error.html"));
});

server.on("request", (req, res) => {
        app(req, res);
});

server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else {
        socket.end();
    }
});

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});
server.listen({ port: PORT });
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
function shutdown() {
    console.log(chalk.redBright("Shutting Down SkioProxy..."));
    server.close();
    process.exit(0);
}
