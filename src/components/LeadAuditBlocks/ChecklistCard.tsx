"use client";

import {
    Badge,
    Card,
    Heading,
    Text,
    VStack,
    Box,
    Flex,
    Separator,
    Float,
} from "@chakra-ui/react";

interface ChecklistCardProps {
    check: any;
}

export default function ChecklistCard({
    check,
}: ChecklistCardProps) {
    return (
        <Card.Root
            shadow="sm"
            borderWidth="1px"
        >
            <Card.Body>

                <VStack
                    align="stretch"
                    gap={3}
                >

                    <Flex flexDir={"row"} justifyContent={"space-between"} mb="1">
                        <Heading
                            size="md"
                            fontWeight={600}
                            textStyle="1xl"
                        >
                            {check.check_name}
                        </Heading>
                        <Badge
                            w="fit-content"
                            colorPalette={
                                check.severity === "Critical"
                                    ? "red"
                                    : check.severity === "Major"
                                        ? "orange"
                                        : "green"
                            }
                        >
                            {check.severity}
                        </Badge>
                    </Flex>

                    <Separator />

                    
                    {check.description && (
                        <Box>
                            <Text
                                fontSize="sm"
                            >
                                Description
                            </Text>

                            <Text
                                fontSize="sm"
                                color="#666"
                            >
                                {check.description}
                            </Text>
                        </Box>
                    )}

                    <Box>
                        <Text
                                fontSize="sm"
                            >
                            Pass Criteria
                        </Text>

                        <Text
                            fontSize="sm"
                            color="gray.600"
                        >
                            {check.pass_criteria}
                        </Text>
                    </Box>

                    {check.example_pass && (
                        <Box>
                            <Text
                                fontSize="sm"
                            >
                                Example Pass
                            </Text>

                            <Text
                                fontSize="sm"
                                color="green.600"
                            >
                                {check.example_pass}
                            </Text>
                        </Box>
                    )}

                    {check.example_fail && (
                        <Box>
                            <Text
                                fontSize="sm"
                            >
                                Example Fail
                            </Text>

                            <Text
                                fontSize="sm"
                                color="red.500"
                            >
                                {check.example_fail}
                            </Text>
                        </Box>
                    )}

                    {check.notes && (
                        <Box>
                            <Text
                                fontSize="sm"
                            >
                                Notes
                            </Text>

                            <Text
                                fontSize="sm"
                                color="gray.500"
                            >
                                {check.notes}
                            </Text>
                        </Box>
                    )}

                    <Float placement={"bottom-center"}>
                        <Badge
                            w="fit-content"
                            colorPalette={"grey"}
                        >
                            {check.source}
                        </Badge>
                    </Float>

                </VStack>

            </Card.Body>
        </Card.Root>
    );
}