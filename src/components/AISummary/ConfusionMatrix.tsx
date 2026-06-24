"use client";

import {
    Box,
    Flex,
    Grid,
    Heading,
    Text
} from "@chakra-ui/react";

interface Metrics {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
}

interface Props {
    metrics: Metrics;
}

export default function ConfusionMatrix({
    metrics
}: Props) {

    const confusionData = [
        {
            label: "TP",
            description: "AI Fail + Human Fail",
            value: metrics.tp,
            color: "#18794E"
        },
        {
            label: "FP",
            description: "AI Fail + Human Pass",
            value: metrics.fp,
            color: "#B7791F"
        },
        {
            label: "FN",
            description: "AI Pass + Human Fail",
            value: metrics.fn,
            color: "#C53030"
        },
        {
            label: "TN",
            description: "AI Pass + Human Pass",
            value: metrics.tn,
            color: "#2B6CB0"
        }
    ];

    return (
        <Box
            bg="white"
            p={5}
            borderRadius="md"
            shadow="sm"
        >
            <Heading
                size="sm"
                mb={4}
                color="blue.900"
            >
                Confusion Matrix
            </Heading>

            <Grid
                templateColumns="repeat(2,1fr)"
                gap={3}
            >
                {confusionData.map((item) => (
                    <Box
                        key={item.label}
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                        borderLeft={`5px solid ${item.color}`}
                        borderRadius="md"
                    >
                        <Flex
                            justify="space-between"
                            align="baseline"
                        >
                            <Heading
                                size="md"
                                color={item.color}
                            >
                                {item.label}
                            </Heading>

                            <Heading size="lg">
                                {item.value}
                            </Heading>
                        </Flex>

                        <Text
                            mt={2}
                            fontSize="xs"
                            color="gray.500"
                        >
                            {item.description}
                        </Text>
                    </Box>
                ))}
            </Grid>
        </Box>
    );
}