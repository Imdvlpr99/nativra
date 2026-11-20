# @nativra/mcp

An [MCP](https://modelcontextprotocol.io) server that lets AI agents (Claude Code, Cursor, and other MCP clients) search, read and install [Nativra](https://nativra.vercel.app) components in your React Native or Expo project.

It runs the `nativra-cli` it ships with, so everything works exactly as on the command line: your `nativra.json`, the lockfile, backups, and the CLI's path and HTTPS checks.

## Setup

Add it to your project's `.mcp.json` (Claude Code) or your client's MCP settings:

```json
{
  "mcpServers": {
    "nativra": {
      "command": "npx",
      "args": ["-y", "@nativra/mcp"]
    }
  }
}
```

The server acts on the directory it starts in. Each tool also takes an absolute `cwd` for another project.

## Tools

| Tool | What it does |
|------|--------------|
| `nativra_search` | Search the registries by id, name, description or tag |
| `nativra_list` | List items by type; `installed` shows this project's items, `outdated` only those with updates |
| `nativra_info` | An item's metadata; `includeDocs` adds its usage docs |
| `nativra_init` | Create `nativra.json` with detected defaults |
| `nativra_add` | Install items and their dependencies (`dryRun`, `overwrite`, `installDependencies`) |
| `nativra_diff` | Compare an installed item with the registry (`summary` for one line per file) |
| `nativra_update` | Update installed items; files you edited are skipped, never overwritten |
| `nativra_doctor` | Check the setup and report problems |

`nativra_add` keeps existing files unless `overwrite` is set. Overwritten files are backed up, so `npx nativra-cli rollback <id>` restores them. Nothing here can force-update edited files or remove items: do that yourself with the CLI.

## Environment

| Variable | Use |
|----------|-----|
| `NATIVRA_PROJECT_ROOT` | Default project directory, instead of the server's working directory |
| `NATIVRA_REGISTRY` | A registry URL or local path that replaces the project's registries |
| `NATIVRA_CLI` | Path to another `nativra-cli` build (`dist/cli.js`) |
