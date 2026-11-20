import React from "react";
import { Link } from "react-router";
import { Seo } from "@/lib/head";
import { Callout, Defs, P, PageHeader, Section } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";
import { CommandLine } from "@/components/ui/CopyButton";

const MCP_JSON = `{
  "mcpServers": {
    "nativra": {
      "command": "npx",
      "args": ["-y", "nativra-mcp"]
    }
  }
}`;

const PROMPTS = `Add a sign-up screen with Nativra: name, email, password, and a terms checkbox.

Which Nativra items are out of date in this project? Show me what changed in button before updating.

Find a Nativra component for picking a country with dial codes and add it.`;

export default function AiAgents() {
  return (
    <>
      <Seo
        title={"Use with AI agents"}
        description={"Let Claude Code, Cursor and other MCP clients search, read and install Nativra components with the nativra-mcp server."}
        path="/docs/ai-agents"
      />
      <PageHeader
        eyebrow="Guides"
        title="Use with AI agents"
        description="nativra-mcp is an MCP server that lets coding agents search the registry, read an item's docs and install it, with the same checks as the CLI."
        meta={["3 min read"]}
      />

      <Section id="setup" title="Set it up">
        <P>
          <p>
            The server runs the <code>nativra-cli</code> it ships with, so it follows your <code>nativra.json</code>, lockfile and
            backups exactly as the CLI does. It acts on the folder your agent starts it in, so set it up per project.
          </p>
          <p>
            <strong>Claude Code:</strong> add it from your project folder.
          </p>
        </P>
        <CommandLine command="claude mcp add nativra -- npx -y nativra-mcp" />
        <P>
          <p>
            <strong>Cursor, and other MCP clients:</strong> add this to the client&apos;s MCP config: <code>.cursor/mcp.json</code>{" "}
            for Cursor, or <code>.mcp.json</code> at the project root for Claude Code.
          </p>
        </P>
        <CodeBlock code={MCP_JSON} lang="json" title=".mcp.json" />
        <Callout type="note" title="Run init first">
          The tools need a <code>nativra.json</code>. Run <code>npx nativra-cli init</code> yourself, or ask the agent to; it has an{" "}
          <code>nativra_init</code> tool.
        </Callout>
      </Section>

      <Section id="tools" title="What the agent can do">
        <Defs
          items={[
            { term: "nativra_search", desc: "Search every configured registry by id, name, description or tag." },
            { term: "nativra_list", desc: "List items by type; with installed, what this project has and whether updates exist; with outdated, only those." },
            { term: "nativra_info", desc: "An item's metadata, dependencies and platforms. With includeDocs, its usage docs, so the agent writes correct props." },
            { term: "nativra_init", desc: "Create nativra.json with detected defaults." },
            { term: "nativra_add", desc: "Install items and their dependencies, rewriting imports to your aliases. Supports dryRun." },
            { term: "nativra_diff", desc: "Compare installed files with the registry, as a patch or a one-line-per-file summary." },
            { term: "nativra_update", desc: "Update installed items. Files you edited are skipped and reported." },
            { term: "nativra_doctor", desc: "Check the setup: config, aliases, NativeWind and dependencies." },
          ]}
        />
        <P>
          <p>Ask in plain language. For example:</p>
        </P>
        <CodeBlock code={PROMPTS} lang="text" title="example prompts" />
      </Section>

      <Section id="safety" title="What it won't do">
        <P>
          <p>
            Installed files are your code, so the server is deliberately limited. It can&apos;t remove items, roll back, or
            force-overwrite a file you edited. <code>nativra_add</code> keeps existing files unless the agent passes{" "}
            <code>overwrite</code>, and overwritten files are backed up first, so{" "}
            <Link to="/docs/updating">rollback</Link> restores them.
          </p>
          <p>
            Every call runs the CLI with an argument list, never a shell. Item names are checked before they reach it, so an agent
            can&apos;t slip in a flag such as <code>--registry</code>. Remote registries must use HTTPS, as with the CLI.
          </p>
        </P>
      </Section>

      <Section id="environment" title="Environment variables">
        <Defs
          items={[
            { term: "NATIVRA_PROJECT_ROOT", desc: "Default project folder, instead of the folder the server starts in. Each tool also takes an absolute cwd." },
            { term: "NATIVRA_REGISTRY", desc: "A registry URL or local folder that replaces the project's registries, e.g. your team's own (see Custom registries)." },
            { term: "NATIVRA_CLI", desc: "Path to another nativra-cli build (dist/cli.js), for testing a local checkout." },
          ]}
        />
      </Section>
    </>
  );
}
