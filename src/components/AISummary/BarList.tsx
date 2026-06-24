"use client";

import {
    Box,
    Flex,
    Heading,
    Stack,
    Text
} from "@chakra-ui/react";

interface Props {
    title: string;
    items: [string, number][];
    color?: string;
}

export default function BarList({
    title,
    items,
    color = "#3182CE"
}: Props) {

    const maxValue = Math.max(
        ...items.map(item => item[1]),
        1
    );

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
                {title}
            </Heading>

            <Stack gap={3}>
                {items.length === 0 && (
                    <Text
                        color="gray.500"
                        fontSize="sm"
                    >
                        No data available.
                    </Text>
                )}

                {items.map(([label, value]) => (
                    <Box key={label}>
                        <Flex
                            justify="space-between"
                            mb={1}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight={600}
                            >
                                {label}
                            </Text>

                            <Text fontSize="sm">
                                {value}
                            </Text>
                        </Flex>

                        <Box
                            h="10px"
                            bg="gray.100"
                            borderRadius="md"
                            overflow="hidden"
                        >
                            <Box
                                h="100%"
                                bg={color}
                                w={`${(value / maxValue) * 100}%`}
                            />
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}