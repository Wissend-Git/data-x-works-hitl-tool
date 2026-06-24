"use client";

import {
    Box,
    Grid,
    Heading,
    Text
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

interface Props {
    metrics: Metrics;
}

const percent = (value: number) =>
    `${Math.round(value * 100)}%`;

const metricColor = (value: number) => {
    if (value >= 0.85) return "green.600";
    if (value >= 0.65) return "orange.500";
    return "red.500";
};

export default function MetricCards({
    metrics
}: Props) {

    const performanceMetrics = [
        {
            label: "Precision",
            value: metrics.precision
        },
        {
            label: "Recall",
            value: metrics.recall
        },
        {
            label: "Accuracy",
            value: metrics.accuracy
        },
        {
            label: "F1 Score",
            value: metrics.f1Score
        }
    ];

    return (
        <Grid
            templateColumns="repeat(auto-fit,minmax(180px,1fr))"
            gap={4}
            mb={5}
        >
            <Box
                bg="white"
                p={5}
                borderRadius="md"
                shadow="sm"
            >
                <Text
                    color="gray.500"
                    fontSize="sm"
                >
                    Audited Checks
                </Text>

                <Heading color="blue.900">
                    {metrics.total}
                </Heading>
            </Box>

            {performanceMetrics.map((metric) => (
                <Box
                    key={metric.label}
                    bg="white"
                    p={5}
                    borderRadius="md"
                    shadow="sm"
                >
                    <Text
                        color="gray.500"
                        fontSize="sm"
                    >
                        {metric.label}
                    </Text>

                    <Heading
                        color={metricColor(metric.value)}
                    >
                        {percent(metric.value)}
                    </Heading>
                </Box>
            ))}
        </Grid>
    );
}