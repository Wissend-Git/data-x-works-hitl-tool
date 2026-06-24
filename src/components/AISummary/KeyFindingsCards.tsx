"use client";

import {
    Badge,
    Box,
    Grid,
    Heading,
    Text,
    VStack
} from "@chakra-ui/react";

interface Finding {
    title: string;
    description: string;
    impact?: string;
    severity?: string;
}

interface Props {
    findings: Finding[];
}

const severityColor = (severity?: string) => {
    switch ((severity || "").toLowerCase()) {
        case "critical":
            return {
                bg: "red.100",
                color: "red.700"
            };

        case "major":
            return {
                bg: "orange.100",
                color: "orange.700"
            };

        case "minor":
            return {
                bg: "yellow.100",
                color: "yellow.700"
            };

        default:
            return {
                bg: "blue.100",
                color: "blue.700"
            };
    }
};

export default function KeyFindingsCards({
    findings
}: Props) {

    return (
        <Box>
            <Heading
                size="sm"
                mb={4}
                color="blue.900"
            >
                Key Findings
            </Heading>

            <Grid
                templateColumns={{
                    base: "1fr",
                    lg: "1fr 1fr"
                }}
                gap={4}
            >
                {findings.map((finding, index) => {
                    const severity = severityColor(
                        finding.severity
                    );

                    return (
                        <Box
                            key={`${finding.title}-${index}`}
                            bg="white"
                            p={5}
                            borderRadius="md"
                            shadow="sm"
                            borderTop="4px solid"
                            borderColor="blue.500"
                        >
                            <VStack
                                align="stretch"
                                gap={3}
                            >
                                <Box>
                                    <Text
                                        fontWeight={700}
                                        fontSize="md"
                                        color="blue.900"
                                    >
                                        {finding.title}
                                    </Text>

                                    {finding.severity && (
                                        <Badge
                                            mt={2}
                                            bg={severity.bg}
                                            color={severity.color}
                                        >
                                            {finding.severity}
                                        </Badge>
                                    )}
                                </Box>

                                <Text
                                    fontSize="sm"
                                    color="gray.700"
                                >
                                    {finding.description}
                                </Text>

                                {finding.impact && (
                                    <Box
                                        p={3}
                                        bg="gray.50"
                                        borderRadius="md"
                                    >
                                        <Text
                                            fontSize="xs"
                                            color="gray.500"
                                            mb={1}
                                        >
                                            Business Impact
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            color="gray.700"
                                        >
                                            {finding.impact}
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </Box>
                    );
                })}
            </Grid>

            {findings.length === 0 && (
                <Box
                    bg="white"
                    p={5}
                    borderRadius="md"
                    shadow="sm"
                >
                    <Text color="gray.500">
                        No significant findings identified.
                    </Text>
                </Box>
            )}
        </Box>
    );
}