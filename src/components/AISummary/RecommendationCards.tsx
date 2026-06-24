"use client";

import {
    Badge,
    Box,
    Grid,
    Heading,
    Stack,
    Text
} from "@chakra-ui/react";

interface Recommendation {
    priority: string;
    action: string;
    reason?: string;
}

interface Props {
    recommendations: Recommendation[];
}

const priorityStyle = (priority?: string) => {
    switch ((priority || "").toLowerCase()) {
        case "high":
            return {
                bg: "red.100",
                color: "red.700",
                border: "red.400"
            };

        case "medium":
            return {
                bg: "orange.100",
                color: "orange.700",
                border: "orange.400"
            };

        default:
            return {
                bg: "green.100",
                color: "green.700",
                border: "green.400"
            };
    }
};

export default function RecommendationCards({
    recommendations
}: Props) {

    return (
        <Box>
            <Heading
                size="sm"
                mb={4}
                color="blue.900"
            >
                Recommended Actions
            </Heading>

            <Grid
                templateColumns={{
                    base: "1fr",
                    lg: "1fr 1fr"
                }}
                gap={4}
            >
                {recommendations.map((item, index) => {

                    const style = priorityStyle(
                        item.priority
                    );

                    return (
                        <Box
                            key={`${item.action}-${index}`}
                            bg="white"
                            p={5}
                            borderRadius="md"
                            shadow="sm"
                            borderLeft="5px solid"
                            borderColor={style.border}
                        >
                            <Stack gap={3}>
                                <Badge
                                    w="fit-content"
                                    bg={style.bg}
                                    color={style.color}
                                    px={3}
                                    py={1}
                                >
                                    {item.priority} Priority
                                </Badge>

                                <Text
                                    fontWeight={700}
                                    color="gray.800"
                                >
                                    {item.action}
                                </Text>

                                {item.reason && (
                                    <Text
                                        fontSize="sm"
                                        color="gray.600"
                                    >
                                        {item.reason}
                                    </Text>
                                )}
                            </Stack>
                        </Box>
                    );
                })}
            </Grid>

            {recommendations.length === 0 && (
                <Box
                    bg="white"
                    p={5}
                    borderRadius="md"
                    shadow="sm"
                >
                    <Text color="gray.500">
                        No recommendations available.
                    </Text>
                </Box>
            )}
        </Box>
    );
}