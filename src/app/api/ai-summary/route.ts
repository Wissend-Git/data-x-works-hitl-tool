import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type ReviewStatus = "pass" | "fail";

interface AuditAttribute {
    Attribute?: string;
    "Source Value"?: string | null;
    "Extracted Value"?: string | null;
    "Reviewer Status"?: ReviewStatus | string;
    "Failure Category"?: string;
    "Reviewer Corrected Value"?: string;
    "Source Evidence"?: string;
    Comments?: string;
}

interface AuditRecord {
    sku?: string;
    quality_criteria?: string;
    attribute_set?: AuditAttribute[];
}

interface FlatAuditRecord {
    project_name?: string;
    audit_core?: string;
    category_name?: string;
    url?: string;
    severity?: string;
    ai_result?: ReviewStatus | string;
    human_result?: ReviewStatus | string;
    validation_type?: "TP" | "FP" | "FN" | "TN" | string;
    failure_category?: string;
    actual_value?: string | null;
    expected_value?: string | null;
    reviewer_comment?: string;
    user?: string;
    reviewed_at?: string;
}

type AuditOutputRecord = AuditRecord | FlatAuditRecord;

interface ClientAuditCheck {
    source?: string;
    requires_client_approval?: boolean;
    client_enabled?: boolean;
    category?: string;
    check_name?: string;
    description?: string;
    pass_criteria?: string;
    severity?: string;
    example_pass?: string;
    example_fail?: string;
    notes?: string;
    failure_category?: string;
    short_description?: string;
    example?: string;
}

interface ClientAuditDefinition {
    project_name?: string;
    audit_core?: string;
    core_description?: string;
    category_name?: string;
    criteria_name?: string;
    criteria_description?: string;
    audit_checks?: ClientAuditCheck[];
    criteria_checklist?: ClientAuditCheck[];
}

interface MetricSummary {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
    total: number;
    precision: number;
    recall: number;
    accuracy: number;
    f1Score: number;
}

interface AISummaryResponse {
    executive_summary: string[];
    key_findings: {
        title: string;
        description: string;
        impact?: string;
        severity?: string;
    }[];
    recommendations: {
        priority: string;
        action: string;
        reason?: string;
    }[];
    risk_level: string;
}

const auditOutputPath = path.join(
    process.cwd(),
    "src",
    "data",
    "outputs",
    "audit_files",
    "qc_audit_file_sample.json"
);

// "qc_audit_output_20260622_141055.json"

const criteriaPath = path.join(
    process.cwd(),
    "src",
    "data",
    "outputs",
    "criteria_output.json"
);

const normalize = (value?: string | null) =>
    String(value ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/["']/g, "")
        .toLowerCase();

const isAiPass = (attribute: AuditAttribute) =>
    normalize(attribute["Source Value"]) === normalize(attribute["Extracted Value"]);

const safeDivide = (numerator: number, denominator: number) =>
    denominator === 0 ? 0 : Number((numerator / denominator).toFixed(4));

const asPercent = (value: number) => `${Math.round(value * 100)}%`;

const readAuditOutput = (): AuditOutputRecord[] => {
    if (!fs.existsSync(auditOutputPath)) {
        return [];
    }

    const raw = fs.readFileSync(auditOutputPath, "utf8");
    if (!raw.trim()) {
        return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
};

const isFlatAuditRecord = (record: AuditOutputRecord): record is FlatAuditRecord =>
    "ai_result" in record ||
    "human_result" in record ||
    "validation_type" in record ||
    "audit_type" in record ||
    "url" in record;

const readClientAuditDefinitions = (): ClientAuditDefinition[] => {
    if (!fs.existsSync(criteriaPath)) {
        return [];
    }

    const raw = fs.readFileSync(criteriaPath, "utf8");
    if (!raw.trim()) {
        return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
};

const getRelevantAuditDefinitions = (
    records: AuditOutputRecord[],
    definitions: ClientAuditDefinition[]
) => {
    const selectedCriteria = new Set(
        records
            .map((record) =>
                isFlatAuditRecord(record) ? record.audit_core : record.quality_criteria
            )
            .filter(Boolean)
            .map((criteria) => normalize(criteria))
    );

    const matchingDefinitions = definitions.filter((definition) => {
        const names = [
            definition.criteria_name,
            definition.audit_core,
            definition.category_name,
        ]
            .filter(Boolean)
            .map((name) => normalize(name));

        return names.some((name) => selectedCriteria.has(name));
    });

    return matchingDefinitions.length > 0 ? matchingDefinitions : definitions;
};

const getChecks = (definition: ClientAuditDefinition) =>
    definition.audit_checks ?? definition.criteria_checklist ?? [];

const applyMetricResult = (
    metrics: MetricSummary,
    aiResult?: string,
    humanResult?: string,
    validationType?: string
) => {
    const normalizedValidationType = String(validationType ?? "").toUpperCase();

    if (["TP", "FP", "FN", "TN"].includes(normalizedValidationType)) {
        metrics.total += 1;
        metrics[normalizedValidationType.toLowerCase() as "tp" | "fp" | "fn" | "tn"] += 1;
        return;
    }

    const aiStatus = normalize(aiResult);
    const humanStatus = normalize(humanResult);

    if (
        (aiStatus !== "pass" && aiStatus !== "fail") ||
        (humanStatus !== "pass" && humanStatus !== "fail")
    ) {
        return;
    }

    const aiFailed = aiStatus === "fail";
    const humanFailed = humanStatus === "fail";

    metrics.total += 1;

    if (aiFailed && humanFailed) metrics.tp += 1;
    if (aiFailed && !humanFailed) metrics.fp += 1;
    if (!aiFailed && humanFailed) metrics.fn += 1;
    if (!aiFailed && !humanFailed) metrics.tn += 1;
};

const calculateMetrics = (records: AuditOutputRecord[]): MetricSummary => {
    const metrics: MetricSummary = {
        tp: 0,
        fp: 0,
        fn: 0,
        tn: 0,
        total: 0,
        precision: 0,
        recall: 0,
        accuracy: 0,
        f1Score: 0,
    };

    records.forEach((record) => {
        if (isFlatAuditRecord(record)) {
            applyMetricResult(
                metrics,
                record.ai_result,
                record.human_result,
                record.validation_type
            );
            return;
        }

        record.attribute_set?.forEach((attribute) => {
            applyMetricResult(
                metrics,
                isAiPass(attribute) ? "pass" : "fail",
                attribute["Reviewer Status"]
            );
        });
    });

    metrics.precision = safeDivide(metrics.tp, metrics.tp + metrics.fp);
    metrics.recall = safeDivide(metrics.tp, metrics.tp + metrics.fn);
    metrics.accuracy = safeDivide(metrics.tp + metrics.tn, metrics.total);
    metrics.f1Score = safeDivide(
        2 * metrics.precision * metrics.recall,
        metrics.precision + metrics.recall
    );

    return metrics;
};

const getConfiguredChecks = (definitions: ClientAuditDefinition[]) =>
    definitions.flatMap((definition) => getChecks(definition));

const resolveCheckName = (
    record: FlatAuditRecord,
    checks: ClientAuditCheck[]
) => {
    const category = normalize(record.failure_category);
    if (category && category !== "n/a") {
        const categoryMatch = checks.find(
            (check) => normalize(check.check_name || check.failure_category) === category
        );
        return categoryMatch?.check_name || record.failure_category || "Uncategorized";
    }

    const comment = normalize(record.reviewer_comment);
    const commentMatch = checks.find((check) => {
        const checkName = normalize(check.check_name || check.failure_category);
        return checkName.length > 0 && comment.includes(checkName);
    });

    return commentMatch?.check_name || "Uncategorized";
};

const groupFailures = (
    records: AuditOutputRecord[],
    auditDefinitions: ClientAuditDefinition[]
) => {
    const failureCategories: Record<string, number> = {};
    const skuFailures: Record<string, number> = {};
    const attributeFailures: Record<string, number> = {};
    const severityFailures: Record<string, number> = {};
    const userFailures: Record<string, number> = {};
    const validationOutcomes: Record<string, number> = {};
    const checkIssues: Record<string, number> = {};
    const checks = getConfiguredChecks(auditDefinitions);

    records.forEach((record) => {
        if (isFlatAuditRecord(record)) {
            const humanFailed = normalize(record.human_result) === "fail";
            const validationType = String(record.validation_type ?? "").toUpperCase();

            if (["TP", "FP", "FN", "TN"].includes(validationType)) {
                validationOutcomes[validationType] =
                    (validationOutcomes[validationType] ?? 0) + 1;
            }

            if (["TP", "FP", "FN"].includes(validationType)) {
                const checkName = resolveCheckName(record, checks);
                checkIssues[checkName] = (checkIssues[checkName] ?? 0) + 1;
            }

            if (!humanFailed && validationType !== "TP" && validationType !== "FN") {
                return;
            }

            const category = record.failure_category || "Uncategorized";
            const url = record.url || record.project_name || "Unknown Page";
            const auditType = record.audit_core || "Unknown Audit Type";
            const severity = record.severity || "Unspecified";
            const user = record.user || "Unknown User";

            failureCategories[category] = (failureCategories[category] ?? 0) + 1;
            skuFailures[url] = (skuFailures[url] ?? 0) + 1;
            attributeFailures[auditType] = (attributeFailures[auditType] ?? 0) + 1;
            severityFailures[severity] = (severityFailures[severity] ?? 0) + 1;
            userFailures[user] = (userFailures[user] ?? 0) + 1;
            return;
        }

        record.attribute_set?.forEach((attribute) => {
            const humanFailed =
                String(attribute["Reviewer Status"] ?? "").toLowerCase() === "fail";

            if (!humanFailed) {
                return;
            }

            const category = attribute["Failure Category"] || "Uncategorized";
            const sku = record.sku || "Unknown SKU";
            const attributeName = attribute.Attribute || "Unknown Attribute";

            failureCategories[category] = (failureCategories[category] ?? 0) + 1;
            skuFailures[sku] = (skuFailures[sku] ?? 0) + 1;
            attributeFailures[attributeName] = (attributeFailures[attributeName] ?? 0) + 1;
        });
    });

    return {
        failureCategories,
        skuFailures,
        attributeFailures,
        severityFailures,
        userFailures,
        validationOutcomes,
        checkIssues,
    };
};

// const buildLocalSummary = (
//     metrics: MetricSummary,
//     groups: ReturnType<typeof groupFailures>,
//     auditDefinitions: ClientAuditDefinition[]
// ) => {
//     const leadingCategory = Object.entries(groups.failureCategories).sort(
//         (a, b) => b[1] - a[1]
//     )[0];

//     const leadingAttribute = Object.entries(groups.checkIssues).sort(
//         (a, b) => b[1] - a[1]
//     )[0];

//     const passCriteriaCount = auditDefinitions.reduce(
//         (count, definition) =>
//             count +
//             getChecks(definition).filter((check) => Boolean(check.pass_criteria)).length,
//         0
//     );

//     return [
//         `The HITL review covered ${metrics.total} audited checks.`,
//         `Model precision is ${asPercent(metrics.precision)}, recall is ${asPercent(
//             metrics.recall
//         )}, accuracy is ${asPercent(metrics.accuracy)}, and F1 score is ${asPercent(
//             metrics.f1Score
//         )}.`,
//         passCriteriaCount > 0
//             ? `The AI interpretation uses ${passCriteriaCount} client-defined pass criteria rule(s) as the audit standard.`
//             : "No client-defined pass criteria were available, so the summary uses reviewer outcomes and failure categories.",
//         leadingCategory
//             ? `The most frequent human failure category is ${leadingCategory[0]} with ${leadingCategory[1]} issue(s).`
//             : "No human failure category is currently dominant.",
//         leadingAttribute
//             ? `${leadingAttribute[0]} is the audit check with the highest number of disagreement or confirmed-failure outcomes.`
//             : "No repeated audit-check issue is visible yet.",
//     ].join(" ");
// };

const buildLocalSummary = (
    metrics: MetricSummary,
    groups: ReturnType<typeof groupFailures>
): AISummaryResponse => {

    const topCategory =
        Object.entries(groups.failureCategories)
            .sort((a, b) => b[1] - a[1])[0];

    const riskLevel =
        metrics.recall < 0.7
            ? "High"
            : metrics.recall < 0.85
                ? "Medium"
                : "Low";

    return {
        executive_summary: [
            `Audit reviewed ${metrics.total} records.`,
            `Precision is ${asPercent(metrics.precision)}.`,
            `Recall is ${asPercent(metrics.recall)}.`,
            topCategory
                ? `${topCategory[0]} is the most common failure category.`
                : "No dominant failure category detected."
        ],

        key_findings: topCategory
            ? [
                {
                    title: topCategory[0],
                    description: `${topCategory[1]} occurrences detected.`,
                    impact: "Repeated audit failures require attention.",
                    severity: "Major"
                }
            ]
            : [],

        recommendations: [
            {
                priority: "High",
                action: "Review top failure categories",
                reason: "Repeated failures indicate rule gaps."
            },
            {
                priority: "Medium",
                action: "Improve validation rules",
                reason: "Reduce false positives and false negatives."
            }
        ],

        risk_level: riskLevel
    };
};

const parseGeminiResponse = (
    response: string
): AISummaryResponse | null => {

    try {

        const cleaned =
            response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        return JSON.parse(cleaned);

    } catch {

        return null;
    }
};

const askGeminiForSummary = async (
    records: AuditOutputRecord[],
    metrics: MetricSummary,
    groups: ReturnType<typeof groupFailures>,
    auditDefinitions: ClientAuditDefinition[]
) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        return null;
    }

    const prompt = `
    You are an expert Quality Audit Analyst preparing an executive business summary from Human-in-the-Loop (HITL) audit results.

Your goal is to produce a concise, actionable, dashboard-ready summary that explains audit quality, model performance, business risk, and improvement opportunities.

REPORTING OBJECTIVES

* Focus on business outcomes, audit quality, and model reliability.
* Treat each audit check's pass_criteria as the authoritative client acceptance rule.
* Prioritize findings from client_enabled audit checks.
* Mention non-enabled checks only if they materially affect interpretation.
* Use severity, example_pass, example_fail, notes, and reviewer feedback when available to explain business impact.
* Compare audit outcomes against pass_criteria to identify the rules creating the greatest quality risk.
* Use validation_type as the source of truth for TP, FP, FN, and TN classifications.
* Use project_name, audit_core, category_name, url, severity, actual_value, expected_value, reviewer_comment, and user information to make observations specific and evidence-based.
* Explain not only what failed, but why the failures matter to the business.
* Highlight recurring patterns rather than isolated incidents whenever possible.
* Identify whether issues appear to be caused by extraction errors, validation logic gaps, prompt weaknesses, ambiguous requirements, or reviewer interpretation differences.

METRIC DEFINITIONS

TP = AI Fail + Human Fail
FP = AI Fail + Human Pass
FN = AI Pass + Human Fail
TN = AI Pass + Human Pass

Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
Accuracy = (TP + TN) / Total
F1 Score = 2 × Precision × Recall / (Precision + Recall)

METRIC INTERPRETATION GUIDELINES

* Use metrics only when they strengthen the narrative.
* Do not mechanically explain every metric.
* Prioritize business interpretation over mathematical explanation.
* Reference actual counts when they help quantify risk or performance.
* Highlight Precision when false positives are a concern.
* Highlight Recall when missed defects (False Negatives) are a concern.
* Highlight Accuracy when overall reliability is important.
* Highlight F1 Score when discussing overall detection quality.
* If a metric is not meaningful to the findings, omit it.
* Explain what the numbers mean for audit operations, reviewer effort, client trust, and quality outcomes.
* Combine quantitative evidence (metrics) with qualitative evidence (failure examples and reviewer comments).

ANALYSIS EXPECTATIONS

Review the audit data and determine:

1. Overall audit quality and reliability.
2. Major quality risks.
3. Most problematic audit checks.
4. Most common failure categories.
5. Severity trends.
6. Client-rule compliance risks.
7. False Positive patterns.
8. False Negative patterns.
9. Areas where AI performs well.
10. Areas where human review is still required.
11. Opportunities for prompt tuning or rule improvements.
12. Opportunities to reduce manual review effort.

OUTPUT STYLE

* Write in a professional executive-reporting tone.
* Keep findings concise and actionable.
* Avoid repeating raw data.
* Avoid listing every audit check.
* Focus on patterns, trends, risks, and business implications.
* Use natural language rather than statistical jargon.
* Do not generate tables.
* Do not generate JSON.
* Do not output markdown tables.
* Return plain text only.

REQUIRED OUTPUT STRUCTURE

Return ONLY valid JSON.

{
  "executive_summary": [
    "..."
  ],

  "key_findings": [
    {
      "title": "...",
      "description": "...",
      "impact": "...",
      "severity": "Major"
    }
  ],

  "recommendations": [
    {
      "priority": "High",
      "action": "...",
      "reason": "..."
    }
  ],

  "risk_level": "High"
}

CLIENT AUDIT DEFINITIONS

${JSON.stringify(auditDefinitions, null, 2)}

AUDIT METRICS

${JSON.stringify(metrics, null, 2)}

GROUPED FAILURES

${JSON.stringify(groups, null, 2)}

AUDIT RECORDS

${JSON.stringify(records.slice(0, 100), null, 2)}

`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 700,
                },
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const data = await response.json();

    Promise<AISummaryResponse | null>

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        return null;
    }

    return parseGeminiResponse(text);
};

export async function GET() {
    try {
        const records = readAuditOutput();
        const auditDefinitions = getRelevantAuditDefinitions(
            records,
            readClientAuditDefinitions()
        );
        const metrics = calculateMetrics(records);
        const groups = groupFailures(records, auditDefinitions);
        const firstFlatRecord = records.find(isFlatAuditRecord);
        const firstDefinition = auditDefinitions[0];
        const project = {
            // projectId: firstFlatRecord?.project_id ?? null,
            projectName:
                firstDefinition?.project_name ?? firstFlatRecord?.project_name ?? null,
            auditName:
                firstDefinition?.audit_core ?? firstFlatRecord?.project_name ?? null,
            auditType:
                firstDefinition?.category_name ?? firstFlatRecord?.audit_core ?? null,
            description: firstDefinition?.core_description ?? null,
            configuredChecks: getConfiguredChecks(auditDefinitions).length,
        };
        
        let aiSummary =
            buildLocalSummary(
                metrics,
                groups
            );

        let generatedBy = "local";

        try {
            const geminiSummary = await askGeminiForSummary(
                records,
                metrics,
                groups,
                auditDefinitions
            );
            if (geminiSummary) {
                aiSummary = geminiSummary;
                generatedBy = "gemini";
            }
        } catch (error) {
            console.error(error);
        }

        return NextResponse.json({
            success: true,
            generatedBy,
            project,
            records,
            auditDefinitions,
            metrics,
            groups,
            aiSummary,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unable to build summary",
            },
            { status: 500 }
        );
    }
}
