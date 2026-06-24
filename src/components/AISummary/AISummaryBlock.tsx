"use client";

import { useEffect, useState } from "react";

import {
    Box,
    Flex,
    Spinner,
    Text,
    Grid
} from "@chakra-ui/react";

import ProjectHeader from "./ProjectHeader";
import MetricCards from "./MetricCards";
import ConfusionMatrix from "./ConfusionMatrix";
import ExecutiveSummaryCards from "./ExecutiveSummaryCards";
import KeyFindingsCards from "./KeyFindingsCards";
import RecommendationCards from "./RecommendationCards";
import FailureCategoryChart from "./FailureCategoryChart";
import SeverityChart from "./SeverityChart";
import AuditResultsTable from "./AuditResultsTable";
import BarList from "./BarList";

interface Metrics {
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

interface Finding {
    title: string;
    description: string;
    impact?: string;
    severity?: string;
}

interface Recommendation {
    priority: string;
    action: string;
    reason?: string;
}

interface AISummary {
    executive_summary: string[];
    key_findings: Finding[];
    recommendations: Recommendation[];
    risk_level: string;
}

interface AuditDefinitionCheck {
    check_name?: string;
    category?: string;
    failure_category?: string;
    short_description?: string;
    pass_criteria?: string;
    severity?: string;
    client_enabled?: boolean;
}

interface AuditDefinition {
    project_name?: string;
    audit_core?: string;
    core_description?: string;
    category_name?: string;
    criteria_name?: string;
    criteria_description?: string;
    audit_checks?: AuditDefinitionCheck[];
    criteria_checklist?: AuditDefinitionCheck[];
}

interface AuditRecord {
    url?: string;
    severity?: string;
    ai_result?: string;
    human_result?: string;
    validation_type?: string;
    failure_category?: string;
    actual_value?: string | null;
    expected_value?: string | null;
    reviewer_comment?: string;
    user?: string;
}

interface SummaryResponse {
    success: boolean;
    generatedBy: "gemini" | "local";

    project?: {
        // projectId?: string | null;
        projectName?: string | null;
        auditName?: string | null;
        auditType?: string | null;
        description?: string | null;
        configuredChecks?: number;
    };

    metrics: Metrics;

    groups: {
        failureCategories: Record<string, number>;
        skuFailures: Record<string, number>;
        attributeFailures: Record<string, number>;
        severityFailures?: Record<string, number>;
        userFailures?: Record<string, number>;
        validationOutcomes?: Record<string, number>;
        checkIssues?: Record<string, number>;
    };

    records?: AuditRecord[];

    auditDefinitions?: AuditDefinition[];

    aiSummary: AISummary;

}

const sortedEntries = (
    items: Record<string, number>
) =>
    Object.entries(items)
        .sort((a, b) => b[1] - a[1]);

export default function AISummaryBlock() {

    const [summary, setSummary] =
        useState<SummaryResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const loadSummary = async () => {

            try {

                const response =
                    await fetch("/api/ai-summary");

                const result =
                    await response.json();

                if (!result.success) {
                    throw new Error(
                        result.error ||
                        "Unable to load summary"
                    );
                }

                setSummary(result);

            } catch (err) {

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load summary"
                );

            } finally {
                setLoading(false);
            }
        };

        loadSummary();

    }, []);

    if (loading) {

        return (
            <Flex
                minH="70vh"
                align="center"
                justify="center"
                gap={3}
            >
                <Spinner />

                <Text>
                    Generating AI Summary...
                </Text>
            </Flex>
        );
    }

    if (error || !summary) {

        return (
            <Box p={8}>
                <Text color="red.500">
                    {error ||
                        "Summary data unavailable"}
                </Text>
            </Box>
        );
    }

    return (
        <Box p={6}>

            <ProjectHeader
                generatedBy={summary.generatedBy}
                project={summary.project}
            />

            <MetricCards
                metrics={summary.metrics}
            />

            <Grid
                templateColumns={{
                    base: "1fr",
                    xl: "1.1fr 0.9fr"
                }}
                gap={5}
                mb={5}
            >
                <ExecutiveSummaryCards
                    summary={
                        summary.aiSummary
                            ?.executive_summary || []
                    }
                    riskLevel={
                        summary.aiSummary
                            ?.risk_level
                    }
                />

                <ConfusionMatrix
                    metrics={summary.metrics}
                />
            </Grid>

            <Box mb={6}>
                <KeyFindingsCards
                    findings={
                        summary.aiSummary
                            ?.key_findings || []
                    }
                />
            </Box>

            <Box mb={6}>
                <RecommendationCards
                    recommendations={
                        summary.aiSummary
                            ?.recommendations || []
                    }
                />
            </Box>

            <Grid
                templateColumns={{
                    base: "1fr",
                    xl: "1fr 1fr"
                }}
                gap={5}
                mb={5}
            >
                <FailureCategoryChart
                    categories={
                        summary.groups
                            .failureCategories
                    }
                />

                <SeverityChart
                    severity={
                        summary.groups
                            .severityFailures || {}
                    }
                />
            </Grid>

            <Grid
                templateColumns={{
                    base: "1fr",
                    xl: "1fr 1fr"
                }}
                gap={5}
                mb={5}
            >
                <BarList
                    title="Validation Outcomes"
                    items={
                        sortedEntries(
                            summary.groups
                                .validationOutcomes || {}
                        )
                    }
                    color="#3182CE"
                />

                <BarList
                    title="Audit Checks Requiring Attention"
                    items={
                        sortedEntries(
                            summary.groups
                                .checkIssues || {}
                        )
                    }
                    color="#E53E3E"
                />
            </Grid>

            <Grid
                templateColumns={{
                    base: "1fr",
                    xl: "1fr 1fr"
                }}
                gap={5}
                mb={5}
            >
                <BarList
                    title="Failures by Reviewer"
                    items={
                        sortedEntries(
                            summary.groups
                                .userFailures || {}
                        )
                    }
                    color="#38A169"
                />

                <BarList
                    title="Failures by Audit Type"
                    items={
                        sortedEntries(
                            summary.groups
                                .attributeFailures || {}
                        )
                    }
                    color="#805AD5"
                />
            </Grid>

            <AuditResultsTable
                records={
                    summary.records || []
                }
            />

        </Box>
    );

}