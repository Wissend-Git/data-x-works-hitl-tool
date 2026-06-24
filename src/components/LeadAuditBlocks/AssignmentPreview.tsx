"use client";

import {
    Badge,
    Card,
    Heading,
    HStack,
    Text,
    VStack,
} from "@chakra-ui/react";

interface AssignmentPreviewProps {
    assignments: any[];
}

export default function AssignmentPreview({
    assignments,
}: AssignmentPreviewProps) {

    const grouped = assignments.reduce(
        (acc, item) => {
            if (!acc[item.user]) {
                acc[item.user] = [];
            }

            acc[item.user].push(item);

            return acc;
        },
        {}
    );

    return (
        <Card.Root mt={6}>

            <Card.Header>
                <Heading size="md">
                    Audit Preview
                </Heading>
            </Card.Header>

            <Card.Body>

                <VStack
                    align="stretch"
                    gap={4}
                >

                    {Object.entries(grouped).map(
                        ([user, items]: any) => (

                            <Card.Root
                                key={user}
                                variant="outline"
                            >
                                <Card.Body>

                                    <HStack
                                        justify="space-between"
                                        mb={3}
                                    >
                                        <Heading size="sm">
                                            {user}
                                        </Heading>

                                        <Badge
                                            colorPalette="blue"
                                        >
                                            {items.length} Products
                                        </Badge>
                                    </HStack>

                                    <VStack
                                        align="stretch"
                                        gap={2}
                                    >
                                        {items
                                            .slice(0, 5)
                                            .map(
                                                (
                                                    product: any,
                                                    idx: number
                                                ) => (
                                                    <Text
                                                        key={idx}
                                                        fontSize="sm"
                                                    >
                                                        {product.url}
                                                    </Text>
                                                )
                                            )}

                                        {items.length >
                                            5 && (
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                >
                                                    +
                                                    {items.length -
                                                        5}
                                                    more products
                                                </Text>
                                            )}
                                    </VStack>

                                </Card.Body>
                            </Card.Root>
                        )
                    )}

                </VStack>

            </Card.Body>

        </Card.Root>
    );
}