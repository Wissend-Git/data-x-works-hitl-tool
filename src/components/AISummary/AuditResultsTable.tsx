"use client";

import {
    Badge,
    Box,
    Flex,
    Grid,
    Heading,
    Stack,
    Text
} from "@chakra-ui/react";
import { InfoIcon } from "lucide-react";

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

interface Props {
    records: AuditRecord[];
}

interface HoverDataInfoProps {
    record: AuditRecord;
    status: {
        bg: string;
        color: string;
    };
}

const resultColor = (
    result?: string
) => {

    switch (result) {
        case "TP":
            return {
                bg: "green.100",
                color: "green.700"
            };

        case "TN":
            return {
                bg: "blue.100",
                color: "blue.700"
            };

        case "FP":
            return {
                bg: "orange.100",
                color: "orange.700"
            };

        default:
            return {
                bg: "red.100",
                color: "red.700"
            };
    }
};

export default function AuditResultsTable({
    records
}: Props) {

    return (
        <Box mt={6}>
            <Flex
                justify="space-between"
                mb={4}
            >
                <Heading
                    size="sm"
                    color="blue.900"
                >
                    Audit Results
                </Heading>

                <Text
                    fontSize="sm"
                    color="gray.500"
                >
                    {records.length} Records
                </Text>
            </Flex>

            <Stack gap={3}>
                {records.map((record, index) => {

                    const status =
                        resultColor(
                            record.validation_type
                        );

                    return (
                        <Box
                            key={`${record.url}-${index}`}
                            bg="white"
                            p={4}
                            borderRadius="md"
                            shadow="sm"
                        >
                            <Grid
                                templateColumns={{
                                    base: "1fr",
                                    lg: "4fr repeat(5,1fr)"
                                }}
                                gap={4}
                            >
                                <Box>
                                    <Text
                                        fontWeight={700}
                                    >
                                        {record.actual_value || "No Value"}
                                    </Text>

                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        {record.url}
                                    </Text>

                                    <Text
                                        mt={1}
                                        fontSize="sm"
                                        color="gray.600"
                                    >
                                        {record.reviewer_comment ||
                                            "No reviewer comment"}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        AI
                                    </Text>

                                    <Text
                                        fontWeight={600}
                                        fontSize={"md"}
                                        color={
                                            record.ai_result === "Pass" ? "green.600" : "red.600"
                                        }
                                    >
                                        {record.ai_result}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Human
                                    </Text>

                                    <Text
                                        fontWeight={600}
                                        fontSize={"md"}
                                        color={
                                            record.human_result === "Pass" ? "green.600" : "red.600"
                                        }
                                    >
                                        {record.human_result}
                                    </Text>
                                </Box>

                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Severity
                                    </Text>
                                    <Badge
                                        w="fit-content"
                                        colorPalette={
                                            record.severity === "Critical"
                                                ? "red"
                                                : record.severity === "Major"
                                                    ? "orange"
                                                    : "green"
                                        }
                                    >
                                        {record.severity}
                                    </Badge>
                                </Box>

                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Users
                                    </Text>

                                    <Text
                                        mt={1}
                                        fontSize="sm"
                                        color="gray.600"
                                    >
                                        {record.user}
                                    </Text>
                                </Box>

                                {/* <Flex
                                    justify="flex-end"
                                >
                                    <Badge
                                        w="25%" h="-webkit-fit-content"
                                        bg={status.bg}
                                        color={status.color}
                                        justifyContent={"center"}
                                    >
                                        {record.validation_type}
                                    </Badge>
                                </Flex> */}

                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                    >
                                        Validation Type
                                    </Text>
                                    <Badge
                                        w="fit-content"
                                        bg={status.bg}
                                        color={status.color}
                                        justifyContent={"center"}
                                    >
                                        {record.validation_type}
                                    </Badge>
                                </Box>
                            </Grid>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
}