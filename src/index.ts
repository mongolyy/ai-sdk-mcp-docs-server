import { FastMCP } from "fastmcp";
import { docsTool } from "./tools/docs.js"
import { cookbookTool } from "./tools/cookbook.js"
import { providersTool } from "./tools/providers.js"

const server = new FastMCP({
  name: "AI SDK docs server",
  version: "1.0.0",
});

server.addTool(docsTool);
server.addTool(cookbookTool);
server.addTool(providersTool);

server.start({
  transportType: "stdio",
});
