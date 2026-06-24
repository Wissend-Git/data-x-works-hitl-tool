"use client";

import {
    Card,
    Grid,
    GridItem,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";

interface AuditDashboardProps {
    stats: {
        totalProducts: number;
        completed: number;
        pending: number;
        TP: number;
        TN: number;
        FP: number;
        FN: number;
    };
}

const StatCard = ({
    title,
    value,
    bg,
}: {
    title: string;
    value: number;
    bg: string;
}) => {
    return (
        <Card.Root
            bg={bg}
            shadow="md"
            borderRadius="xl"
        >
            <Card.Body py={6}>
                <VStack gap={2}>
                    <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.600"
                    >
                        {title}
                    </Text>

                    <Heading size="xl">
                        {value}
                    </Heading>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

export default function AuditDashboard({
    stats,
}: AuditDashboardProps) {

    return (
        <Grid
            templateColumns={{
                base: "repeat(2,1fr)",
                md: "repeat(4,1fr)",
                xl: "repeat(7,1fr)",
            }}
            gap={4}
        >

            <GridItem>
                <StatCard
                    title="Products"
                    value={stats.totalProducts}
                    bg="blue.50"
                />
            </GridItem>

            <GridItem>
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    bg="green.50"
                />
            </GridItem>

            <GridItem>
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    bg="orange.50"
                />
            </GridItem>

            <GridItem>
                <StatCard
                    title="TP"
                    value={stats.TP}
                    bg="green.100"
                />
            </GridItem>

            <GridItem>
                <StatCard
                    title="TN"
                    value={stats.TN}
                    bg="teal.100"
                />
            </GridItem>

            <GridItem>
                <StatCard
                    title="FP"
                    value={stats.FP}
                    bg="red.100"
                />
            </GridItem>

            <GridItem>
                <StatCard
                    title="FN"
                    value={stats.FN}
                    bg="yellow.100"
                />
            </GridItem>

        </Grid>
    );
}