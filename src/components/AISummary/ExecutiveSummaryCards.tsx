"use client";

import {
    Badge,
    Box,
    Flex,
    Heading,
    Stack,
    Text
} from "@chakra-ui/react";

interface Props {
    summary: string[];
    riskLevel?: string;
}

const riskColor = (risk?: string) => {
    switch ((risk || "").toLowerCase()) {
        case "high":
            return {
                bg: "red.100",
                color: "red.700"
            };

        case "medium":
            return {
                bg: "orange.100",
                color: "orange.700"
            };

        default:
            return {
                bg: "green.100",
                color: "green.700"
            };
    }
};

export default function ExecutiveSummaryCards({
    summary,
    riskLevel
}: Props) {

    const risk = riskColor(riskLevel);

    return (
        <Box
            bg="white"
            p={5}
            borderRadius="md"
            shadow="sm"
        >
            <Flex
                justify="space-between"
                align="center"
                mb={4}
            >
                <Heading
                    size="sm"
                    color="blue.900"
                >
                    Executive Summary
                </Heading>

                {riskLevel && (
                    <Badge
                        px={3}
                        py={1}
                        bg={risk.bg}
                        color={risk.color}
                        borderRadius="full"
                    >
                        {riskLevel} Risk
                    </Badge>
                )}
            </Flex>

            <Stack gap={3}>
                {summary.map((item, index) => (
                    <Box
                        key={index}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        borderLeft="4px solid"
                        borderColor="blue.500"
                    >
                        <Text
                            fontSize="sm"
                            color="gray.700"
                        >
                            ✓ {item}
                        </Text>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}