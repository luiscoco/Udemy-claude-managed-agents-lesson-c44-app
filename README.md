# C44 · Security Hardening

Assesses a local configuration against a narrow reporting policy. It does not provision an environment or audit a deployed system. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Harden in independent layers
- Tool enablement and network policy differ
- Least privilege is task-specific

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3044`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3044
```

## How the app was build

### 1. Check tools, egress and credential scope independently

This read-only-report policy has no need for shell access, unrestricted egress or write-capable service credentials. Each excess capability creates its own finding.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const violations: string[] = [];

if (flag(input, "shellEnabled"))
  violations.push("Shell is unnecessary for the read-only report");

if (flag(input, "unrestrictedNetwork"))
  violations.push("Broad network egress is outside this task policy");

if (flag(input, "vaultWriteScope"))
  violations.push("Write-capable service credentials exceed required scope");
```

### 2. Enforce a separate spending bound

The demo budget must be between 1 and 50 cents. The report succeeds only when every independent layer has no findings; assessing flags does not apply a real sandbox policy.

Source: [src/lesson.ts](src/lesson.ts#L17) · selected statements

```typescript
if (number(input, "budgetCents") < 1 || number(input, "budgetCents") > 50)
  violations.push("Budget is outside the demo host policy");

return report(
  violations.length ? "rejected" : "passed",
  "Assessed independent least-privilege layers",
  {
    violations: violations.length,
    findings: violations,
    policy: "read-only-report-v1",
  },
  [
    "Review required tools",
    "Review allowed destinations",
    "Review service credential scopes",
    "Bound spending separately",
  ],
);
```

### Check your understanding

Run **A narrow reader configuration** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "shellEnabled": false,
    "unrestrictedNetwork": false,
    "vaultWriteScope": false,
    "budgetCents": 25
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "violations": 0
  }
}
```

Then try **Reject an overprivileged profile**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
