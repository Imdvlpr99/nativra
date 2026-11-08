# Security Policy

## Supported Versions

Only the latest minor release series of Nativra (`nativra-cli` and `@nativra/*` workspace packages) receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2.0 | :x:                |

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues or discussions.

Instead, report vulnerabilities privately using [**GitHub Private Vulnerability Reporting**](https://github.com/Imdvlpr99/nativra/security/advisories/new):

1. Navigate to the [**Security**](https://github.com/Imdvlpr99/nativra/security) tab of this repository.
2. Click **Report a vulnerability** to open a private security advisory draft.
3. Provide a clear description, reproduction steps, and affected component/CLI command (`nativra-cli`, `@nativra/registry-builder`, registry items, etc.).

### Response Timeline

- **Initial acknowledgment:** within **48 hours**
- **Triage & severity assessment:** within **5 business days**
- **Fix & coordinated disclosure:** as soon as a patch is verified and published to npm

## Security Measures in Nativra

- **Source-First Ownership:** Components copy directly into your codebase with zero opaque runtime binaries.
- **Registry Path & Hash Verification:** `@nativra/registry-builder` rejects path traversal (`..`, absolute paths, UNC paths) and emits SHA-256 content hashes verified by `nativra-cli`.
- **Automated Scanning:** GitHub CodeQL, Dependabot alerts & security updates, and Secret Scanning with Push Protection are active on `main`.
