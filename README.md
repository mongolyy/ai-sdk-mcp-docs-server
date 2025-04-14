# AI SDK MCP Docs Server

A Model Context Protocol (MCP) server that provides [AI SDK documentation](https://sdk.vercel.ai/), cookbook examples, and provider information.

> [!NOTE]
> This is an unofficial tool and does not provide any guarantees regarding functionality or accuracy.

## Features

- Access AI SDK documentation content
- Retrieve cookbook examples and tutorials
- Get information about AI providers

## Setting up with IDE

This tool can be used with various IDEs that support MCP servers.

### Common Setup

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/mongolyy/ai-sdk-mcp-docs-server.git
   cd ai-sdk-mcp-docs-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### IDE-Specific Configuration

#### Cline

1. Open Cline
2. Click `MCP Servers` link icon
3. Navigate to `Installed` tab and click `configure MCP Servers` button
4. Add a new MCP server with the following configuration (update the path to match your local repository location):

    ``` diff json:cline_mcp_settings.json
    {
      "mcpServers": {
    +    "ai-sdk-mcp-docs-server": {
    +      "command": "npx",
    +      "args": [
    +        "tsx",
    +        "/Users/username/path/to/ai-sdk-mcp-docs-server/src/index.ts"
    +      ]
    +    }
      }
    }
    ```

5. Save the settings
6. Restart Cline to apply the changes

#### Cursor

1. Edit the `~/.cursor/mcp.json` file
2. Add or update the MCP server configuration (update the path to match your local repository location):

    ``` diff json:mcp.json
    {
      "mcpServers": {
    +    "ai-sdk-mcp-docs-server": {
    +      "command": "npx",
    +      "args": [
    +        "tsx",
    +        "/Users/username/path/to/ai-sdk-mcp-docs-server/src/index.ts"
    +      ]
    +    }
      }
    }
    ```

3. Save the file
4. Restart Cursor to apply the changes

## Development

This section provides guidelines for contributing to the project, including coding standards, testing procedures, and how to submit pull requests.

### Installation

```bash
npm install
```

### Run on local

CLI:

```bash
npx fastmcp dev src/index.ts
```

GUI:

```bash
npx fastmcp inspect src/index.ts
```

## Available Tools

- **docs** - Get AI SDK documentation
  - With path: `/docs/introduction` - Get specific doc
  - Without path: Get list of all docs

- **cookbook** - Get cookbook examples
  - With path: `/cookbook/next/generate-text` - Get specific example
  - Without path: Get list of all examples

- **providers** - Get provider information
  - With path: `/providers/ai-sdk-providers` - Get specific provider info
  - Without path: Get list of all providers

## How It Works

The server fetches content from the AI SDK website, parses the HTML, and provides the content through a structured API accessible via the Model Context Protocol.
