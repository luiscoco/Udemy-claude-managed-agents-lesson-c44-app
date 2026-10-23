import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 44,
  title: "Security Hardening",
  description: "Security hardening starts by asking what an agent actually needs to accomplish its task. A report-reading task may need selected files and a narrow read capability, but no shell, broad network access, or write credentials.",
  concepts: ["Harden in independent layers", "Tool enablement and network policy differ", "Least privilege is task-specific"],
  scope: "Assesses a local configuration against a narrow reporting policy. It does not provision an environment or audit a deployed system. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "A narrow reader configuration", "input": {"shellEnabled": false, "unrestrictedNetwork": false, "vaultWriteScope": false, "budgetCents": 25}, "expected": "passed", "checks": {"violations": 0}}, {"id": "1", "label": "Reject an overprivileged profile", "input": {"shellEnabled": true, "unrestrictedNetwork": true, "vaultWriteScope": true, "budgetCents": 1000}, "expected": "rejected", "checks": {"violations": 4}}],
  async run(input) {

const violations:string[]=[];
if(flag(input,"shellEnabled"))violations.push("Shell is unnecessary for the read-only report");
if(flag(input,"unrestrictedNetwork"))violations.push("Broad network egress is outside this task policy");
if(flag(input,"vaultWriteScope"))violations.push("Write-capable service credentials exceed required scope");
if(number(input,"budgetCents")<1||number(input,"budgetCents")>50)violations.push("Budget is outside the demo host policy");
return report(violations.length?"rejected":"passed","Assessed independent least-privilege layers",{violations:violations.length,findings:violations,policy:"read-only-report-v1"},["Review required tools","Review allowed destinations","Review service credential scopes","Bound spending separately"]);

  }
};
