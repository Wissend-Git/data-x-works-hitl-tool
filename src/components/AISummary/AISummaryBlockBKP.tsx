"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Badge,
    Box,
    Flex,
    Grid,
    Heading,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";

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

interface SummaryResponse {
    success: boolean;
    generatedBy: "gemini" | "local";
    auditDefinitions?: AuditDefinition[];
    project?: {
        // projectId?: string | null;
        projectName?: string | null;
        auditName?: string | null;
        auditType?: string | null;
        description?: string | null;
        configuredChecks: number;
    };
    records?: Array<{
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
    }>;
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
    aiSummary: string;
}

const percent = (value: number) => `${Math.round(value * 100)}%`;

const metricColor = (value: number) => {
    if (value >= 0.85) return "#18794E";
    if (value >= 0.65) return "#B7791F";
    return "#C53030";
};

const sortedEntries = (items: Record<string, number>) =>
    Object.entries(items).sort((a, b) => b[1] - a[1]);

const getDefinitionTitle = (definition: AuditDefinition) =>
    definition.audit_core || definition.criteria_name || definition.category_name || "Audit Criteria";

const getDefinitionChecks = (definition: AuditDefinition) =>
    definition.audit_checks ?? definition.criteria_checklist ?? [];

const resultColor = (result?: string) => {
    if (result === "TP") return { bg: "#E6FFFA", color: "#047857" };
    if (result === "TN") return { bg: "#EBF8FF", color: "#2B6CB0" };
    if (result === "FP") return { bg: "#FFF7ED", color: "#B45309" };
    return { bg: "#FFF5F5", color: "#C53030" };
};

function BarList({
    title,
    items,
    color,
}: {
    title: string;
    items: [string, number][];
    color: string;
}) {
    const maxValue = Math.max(...items.map((item) => item[1]), 1);

    return (
        <Box bg="white" p={5} borderRadius={6} boxShadow="sm">
            <Heading size="sm" mb={4} color="#1D2A44">
                {title}
            </Heading>

            <Stack gap={3}>
                {items.length === 0 && (
                    <Text color="gray.500" fontSize="sm">
                        No failures recorded.
                    </Text>
                )}

                {items.map(([label, value]) => (
                    <Box key={label}>
                        <Flex justify="space-between" mb={1} gap={4}>
                            <Text fontSize="sm" fontWeight={600}>
                                {label}
                            </Text>
                            <Text fontSize="sm">{value}</Text>
                        </Flex>
                        <Box h="10px" bg="#EDF2F7" borderRadius={4} overflow="hidden">
                            <Box
                                h="100%"
                                w={`${(value / maxValue) * 100}%`}
                                bg={color}
                            />
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}

export default function AiSummaryPage() {
    const [showAuditResults, setShowAuditResults] = useState(false);
    const [showCriteria, setShowCriteria] = useState(false);
    const [visibleRecords, setVisibleRecords] = useState(10);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const response = await fetch("/api/ai-summary");
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || "Unable to load AI summary");
                }

                setSummary(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to load AI summary");
            } finally {
                setLoading(false);
            }
        };

        loadSummary();
    }, []);

    const performanceMetrics = useMemo(() => {
        if (!summary) return [];

        return [
            ["Precision", summary.metrics.precision],
            ["Recall", summary.metrics.recall],
            ["Accuracy", summary.metrics.accuracy],
            ["F1 Score", summary.metrics.f1Score],
        ] as [string, number][];
    }, [summary]);

    if (loading) {
        return (
            <>
                <Flex minH="80vh" align="center" justify="center" gap={3}>
                    <Spinner />
                    <Text>Generating AI summary...</Text>
                </Flex>
            </>
        );
    }

    if (error || !summary) {
        return (
            <>
                <Box p={8}>
                    <Text color="red.500">{error || "Summary data is not available."}</Text>
                </Box>
            </>
        );
    }

    const { metrics, groups } = summary;
    const confusionData = [
        ["TP", "AI Fail + Human Fail", metrics.tp, "#18794E"],
        ["FP", "AI Fail + Human Pass", metrics.fp, "#B7791F"],
        ["FN", "AI Pass + Human Fail", metrics.fn, "#C53030"],
        ["TN", "AI Pass + Human Pass", metrics.tn, "#2B6CB0"],
    ] as const;

    return (
            <Box p={6}>
                <Flex justify="space-between" align="center" mb={6} gap={4}>
                    <Box>
                        <Heading color="#1D2A44">AI HITL Summary</Heading>
                        <Text color="gray.600" mt={1}>
                            Gemini analysis and calculated audit performance.
                        </Text>
                    </Box>

                    <Badge
                        px={3}
                        py={2}
                        borderRadius={4}
                        bg={summary.generatedBy === "gemini" ? "#E6FFFA" : "#FFF7ED"}
                        color={summary.generatedBy === "gemini" ? "#047857" : "#C2410C"}
                    >
                        {summary.generatedBy === "gemini"
                            ? "Generated by Gemini"
                            : "Local summary"}
                    </Badge>
                </Flex>

                <Box bg="#1D2A44" color="white" p={5} borderRadius={6} mb={5}>
                    <Flex justify="space-between" align="start" gap={6} wrap="wrap">
                        <Box maxW="760px">
                            <Heading size="lg" mt={1}>
                                {summary.project?.projectName || "Quality Audit"}
                            </Heading>
                            <Text mt={2} color="#E2E8F0">
                                {summary.project?.auditName || summary.project?.auditType}
                            </Text>
                            {summary.project?.description && (
                                <Text mt={2} fontSize="sm" color="#CBD5E0">
                                    {summary.project.description}
                                </Text>
                            )}
                        </Box>
                        <Box textAlign="right">
                            <Text fontSize="sm" color="#CBD5E0">Configured checks</Text>
                            <Heading>{summary.project?.configuredChecks ?? 0}</Heading>
                        </Box>
                    </Flex>
                </Box>

                <Grid templateColumns="repeat(auto-fit,minmax(180px,1fr))" gap={4} mb={5}>
                    <Box bg="white" p={5} borderRadius={6} boxShadow="sm">
                        <Text color="gray.500" fontSize="sm">
                            Audited Checks
                        </Text>
                        <Heading color="#1D2A44">{metrics.total}</Heading>
                    </Box>

                    {performanceMetrics.map(([label, value]) => (
                        <Box key={label} bg="white" p={5} borderRadius={6} boxShadow="sm">
                            <Text color="gray.500" fontSize="sm">
                                {label}
                            </Text>
                            <Heading color={metricColor(value)}>{percent(value)}</Heading>
                        </Box>
                    ))}
                </Grid>

                <Grid templateColumns={{ base: "1fr", xl: "1.15fr 0.85fr" }} gap={5}>
                    <Box bg="white" p={5} borderRadius={6} boxShadow="sm">
                        <Heading size="sm" mb={4} color="#1D2A44">
                            AI Analysis
                        </Heading>
                        <Text whiteSpace="pre-line" lineHeight="1.8" color="gray.700">
                            {summary.aiSummary}
                        </Text>
                    </Box>

                    <Box bg="white" p={5} borderRadius={6} boxShadow="sm">
                        <Heading size="sm" mb={4} color="#1D2A44">
                            Confusion Matrix
                        </Heading>
                        <Grid templateColumns="repeat(2,1fr)" gap={3}>
                            {confusionData.map(([label, formula, value, color]) => (
                                <Box
                                    key={label}
                                    p={4}
                                    border="1px solid #E2E8F0"
                                    borderLeft={`5px solid ${color}`}
                                    borderRadius={5}
                                >
                                    <Flex align="baseline" justify="space-between">
                                        <Heading size="md" color={color}>
                                            {label}
                                        </Heading>
                                        <Heading size="lg">{value}</Heading>
                                    </Flex>
                                    <Text fontSize="xs" color="gray.500" mt={2}>
                                        {formula}
                                    </Text>
                                </Box>
                            ))}
                        </Grid>
                    </Box>
                </Grid>

                <Box mt={6}>
                    <Heading size="sm" mb={4} color="#1D2A44">
                        Client Pass Criteria
                    </Heading>

                    <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={4}>
                        {(summary.auditDefinitions ?? []).map((definition, index) => (
                            <Box
                                key={`${getDefinitionTitle(definition)}-${index}`}
                                border="1px solid #E2E8F0"
                                borderRadius={5}
                                p={4}
                            >
                                <Flex justify="space-between" align="start" gap={3} mb={3}>
                                    <Box>
                                        <Text fontWeight={700}>{getDefinitionTitle(definition)}</Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {definition.project_name || definition.category_name || "Client audit rule set"}
                                        </Text>
                                    </Box>
                                    <Badge bg="#EDF2F7" color="#1D2A44">
                                        {getDefinitionChecks(definition).length} checks
                                    </Badge>
                                </Flex>

                                <Stack gap={2}>
                                    {getDefinitionChecks(definition)
                                        .filter((check) => check.pass_criteria)
                                        .map((check, checkIndex) => (
                                            <Box key={`${check.pass_criteria}-${checkIndex}`}>
                                                <Flex gap={2} align="center" mb={1}>
                                                    <Text fontSize="sm" fontWeight={600}>
                                                        {check.check_name ||
                                                            check.failure_category ||
                                                            check.category ||
                                                            "Pass rule"}
                                                    </Text>
                                                    {check.severity && (
                                                        <Badge bg="#FFF7ED" color="#C2410C">
                                                            {check.severity}
                                                        </Badge>
                                                    )}
                                                </Flex>
                                                <Text fontSize="sm" color="gray.600">
                                                    {check.pass_criteria}
                                                </Text>
                                            </Box>
                                        ))}

                                    {getDefinitionChecks(definition).filter((check) => check.pass_criteria)
                                        .length === 0 && (
                                            <Text fontSize="sm" color="gray.500">
                                                No pass criteria configured for this rule set.
                                            </Text>
                                        )}
                                </Stack>
                            </Box>
                        ))}

                        {(summary.auditDefinitions ?? []).length === 0 && (
                            <Text color="gray.500" fontSize="sm">
                                No client audit definition is available yet.
                            </Text>
                        )}
                    </Grid>
                </Box>

                <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={5} mt={5}>
                    <Box bg="white" p={5} borderRadius={6} boxShadow="sm">
                        <Heading size="sm" mb={5} color="#1D2A44">
                            Performance Chart
                        </Heading>

                        <Stack gap={4}>
                            {performanceMetrics.map(([label, value]) => (
                                <Box key={label}>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight={600}>{label}</Text>
                                        <Text>{percent(value)}</Text>
                                    </Flex>
                                    <Box h="14px" bg="#EDF2F7" borderRadius={4} overflow="hidden">
                                        <Box
                                            h="100%"
                                            w={percent(value)}
                                            bg={metricColor(value)}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <BarList
                        title="Audit Checks Requiring Attention"
                        items={sortedEntries(groups.checkIssues ?? {})}
                        color="#C53030"
                    />
                </Grid>

                <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={5} mt={5}>
                    <BarList
                        title="Validation Outcomes"
                        items={sortedEntries(groups.validationOutcomes ?? {})}
                        color="#2B6CB0"
                    />
                    <BarList
                        title="Confirmed Failure Categories"
                        items={sortedEntries(groups.failureCategories)}
                        color="#C53030"
                    />
                </Grid>

                <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={5} mt={5}>
                    <BarList
                        title="Failures by Severity"
                        items={sortedEntries(groups.severityFailures ?? {})}
                        color="#B7791F"
                    />
                    <BarList
                        title="Failures by Reviewer"
                        items={sortedEntries(groups.userFailures ?? {})}
                        color="#18794E"
                    />
                </Grid>

                <Box mt={6}>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="sm" color="#1D2A44">Audit Results</Heading>
                        <Text fontSize="sm" color="gray.500">
                            {summary.records?.length ?? 0} reviewed pages
                        </Text>
                    </Flex>
                    <Stack gap={3}>
                        {(summary.records ?? []).map((record, index) => {
                            const status = resultColor(record.validation_type);
                            return (
                                <Box key={`${record.url}-${index}`} bg="white" p={4} borderRadius={6} boxShadow="sm">
                                    <Grid templateColumns={{ base: "1fr", lg: "minmax(260px,2fr) repeat(4,minmax(90px,0.6fr))" }} gap={4} alignItems="center">
                                        <Box minW={0}>
                                            <Text fontWeight={700} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                                {record.actual_value || "No title value"}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                                {record.url}
                                            </Text>
                                            <Text fontSize="sm" color="gray.600" mt={1}>
                                                {record.reviewer_comment || "No reviewer comment"}
                                            </Text>
                                        </Box>
                                        <Box><Text fontSize="xs" color="gray.500">AI</Text><Text fontWeight={600}>{record.ai_result}</Text></Box>
                                        <Box><Text fontSize="xs" color="gray.500">Human</Text><Text fontWeight={600}>{record.human_result}</Text></Box>
                                        <Box><Text fontSize="xs" color="gray.500">Severity</Text><Text fontWeight={600}>{record.severity}</Text></Box>
                                        <Flex justify={{ base: "start", lg: "end" }}>
                                            <Badge px={3} py={1} bg={status.bg} color={status.color}>
                                                {record.validation_type}
                                            </Badge>
                                        </Flex>
                                    </Grid>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </Box>
    );
}
