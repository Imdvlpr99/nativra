import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

// stdout carries the protocol: anything else goes to stderr.
const server = createServer();
await server.connect(new StdioServerTransport());
console.error("Nativra MCP server running on stdio");
