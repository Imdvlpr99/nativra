import React from "react";
import { Seo } from "@/lib/head";
import cli from "@/generated/cli.json";
import { CommandLine } from "@/components/ui/CopyButton";
import { Callout, Defs, P, PageHeader, Section } from "@/components/ui/Prose";


interface CliCommand {
  name: string;
  usage: string;
  description: string;
  options: Array<{ flags: string; description: string }>;
}

const COMMANDS = (cli as { commands: CliCommand[] }).commands;

/** Reading order: grouped by the job you are doing. Unknown commands land in "Other". */
const GROUPS: Array<{ title: string; intro: string; names: string[] }> = [
  { title: "Set up", intro: "Create and check your project configuration.", names: ["init", "doctor"] },
  { title: "Find and install", intro: "Browse the registry and copy items into your project.", names: ["list", "search", "info", "add", "remove"] },
  { title: "Stay up to date", intro: "Take registry changes without losing local edits.", names: ["diff", "update", "rollback"] },
  { title: "Themes", intro: "Install token sets and wire CSS variables.", names: ["theme list", "theme add"] },
  { title: "Registries", intro: "Use private or community registries alongside the default one.", names: ["registry list", "registry add"] },
  { title: "Quality", intro: "Check your whole app, not just installed items.", names: ["audit"] },
];

/** Hand-picked examples; everything else on this page comes from `nativra --help`. */
const EXAMPLES: Record<string, string[]> = {
  init: ["npx nativra-cli init", "npx nativra-cli init --yes"],
  doctor: ["npx nativra-cli doctor --fix"],
  list: ["npx nativra-cli list --type block"],
  search: ["npx nativra-cli search form"],
  info: ["npx nativra-cli info login-form"],
  add: ["npx nativra-cli add button card input", "npx nativra-cli add login-form --dry-run", "npx nativra-cli add button --yes --on-conflict error"],
  remove: ["npx nativra-cli remove button"],
  diff: ["npx nativra-cli diff button"],
  update: ["npx nativra-cli update", "npx nativra-cli update button --force"],
  rollback: ["npx nativra-cli rollback button", "npx nativra-cli rollback button --force"],
  "theme list": ["npx nativra-cli theme list"],
  "theme add": ["npx nativra-cli theme add midnight --apply-css", "npx nativra-cli theme add zinc --as brand"],
  "registry list": ["npx nativra-cli registry list"],
  "registry add": ["npx nativra-cli registry add acme https://ui.acme.dev"],
  audit: ["npx nativra-cli audit", "npx nativra-cli audit --min-score 80", "npx nativra-cli audit --fix --dry-run", "npx nativra-cli audit --json"],
};

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export default function Cli() {
  const known = new Set(GROUPS.flatMap((g) => g.names));
  const groups = [
    ...GROUPS,
    { title: "Other", intro: "", names: COMMANDS.map((c) => c.name).filter((n) => !known.has(n)) },
  ].filter((g) => g.names.some((n) => COMMANDS.some((c) => c.name === n)));

  return (
    <>
      <Seo title={"CLI reference"} description={"Every nativra-cli command and flag — init, add, diff, update, rollback, remove, doctor, audit, themes and registries — generated from the CLI itself."} path="/docs/cli" />
      <PageHeader
        eyebrow="Reference"
        title="CLI reference"
        description="nativra-cli copies registry items into your project and keeps them up to date. Run it with npx — nothing is added to your app's dependencies."
        meta={`${COMMANDS.length} commands · generated from nativra --help`.split(" · ")}
      />

      <Section id="overview" title="Overview">
        <P>
          <p>
            Every command accepts <code>--cwd &lt;dir&gt;</code> to target another project. Commands that write files never
            overwrite something you changed without asking, and <code>update</code> backs files up first.
          </p>
        </P>
        <div className="grid gap-2 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="rounded-md border border-border p-4">
              <p className="label">{g.title}</p>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {g.names
                  .filter((n) => COMMANDS.some((c) => c.name === n))
                  .map((n) => (
                    <li key={n}>
                      <a href={`#${slug(n)}`} className="font-mono text-[13px] text-muted-foreground hover:text-foreground">
                        {n}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {groups.map((g) => (
        <Section key={g.title} id={`group-${slug(g.title)}`} title={g.title}>
          {g.intro && (
            <P>
              <p>{g.intro}</p>
            </P>
          )}
          <div className="space-y-10 pt-2">
            {g.names
              .map((n) => COMMANDS.find((c) => c.name === n))
              .filter((c): c is CliCommand => Boolean(c))
              .map((c) => (
                <article key={c.name} aria-labelledby={slug(c.name)} className="space-y-3">
                  <h3 id={slug(c.name)} className="font-mono text-base font-semibold text-brand">
                    {c.name}
                  </h3>
                  <p className="text-[15px] text-muted-foreground">{c.description}</p>
                  <code className="block overflow-x-auto whitespace-nowrap rounded-md border border-code-border bg-code px-3 py-2 font-mono text-[13px]">{c.usage}</code>
                  {c.options.length > 0 && <Defs items={c.options.map((o) => ({ term: o.flags, desc: o.description }))} />}
                  {(EXAMPLES[c.name] ?? []).map((ex) => (
                    <CommandLine key={ex} command={ex} />
                  ))}
                </article>
              ))}
          </div>
        </Section>
      ))}

      <Section id="ci" title="Scripting and CI">
        <Callout type="tip" title="Non-interactive runs">
          Pass <code>--yes</code> to skip prompts. With <code>--yes</code>, existing files are kept; add{" "}
          <code>--on-conflict error</code> to fail the job instead, or <code>--overwrite</code> to replace them. Commands exit
          with a non-zero code on failure.
        </Callout>
      </Section>
    </>
  );
}
