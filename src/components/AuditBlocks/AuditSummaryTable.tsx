"use client";

import {
    Badge,
    Card,
    Heading,
    Table,
    Text,
} from "@chakra-ui/react";

interface AuditSummaryTableProps {
    auditResults: any[];
}

const getValidationColor = (
    type: string
) => {

    switch (type) {

        case "TP":
            return "green";

        case "TN":
            return "blue";

        case "FP":
            return "red";

        case "FN":
            return "orange";

        default:
            return "gray";
    }
};

const getSeverityColor = (
    severity: string
) => {

    switch (severity) {

        case "Critical":
            return "red";

        case "Major":
            return "orange";

        case "Minor":
            return "yellow";

        default:
            return "gray";
    }
};

export default function AuditSummaryTable({
    auditResults,
}: AuditSummaryTableProps) {

    return (
        <Card.Root shadow="md">

            <Card.Header>

                <Heading size="md">
                    Audit Summary
                </Heading>

            </Card.Header>

            <Card.Body>

                {auditResults.length === 0 ? (

                    <Text
                        color="gray.500"
                        textAlign="center"
                    >
                        No audits completed yet.
                    </Text>

                ) : (

                    <Table.Root
                        variant="outline"
                        size="sm"
                    >

                        <Table.Header>

                            <Table.Row>

                                <Table.ColumnHeader>
                                    #
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Project
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Category
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    AI
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Human
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Validation
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Severity
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Failure Category
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Reviewer Comment
                                </Table.ColumnHeader>

                            </Table.Row>

                        </Table.Header>

                        <Table.Body>

                            {auditResults.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <Table.Row
                                        key={`${item.url}-${index}`}
                                    >

                                        <Table.Cell>
                                            {index + 1}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {
                                                item.project_name
                                            }
                                        </Table.Cell>

                                        <Table.Cell>
                                            {
                                                item.category_name
                                            }
                                        </Table.Cell>

                                        <Table.Cell>

                                            <Badge
                                                colorPalette={
                                                    item.ai_result ===
                                                    "Pass"
                                                        ? "green"
                                                        : "red"
                                                }
                                            >
                                                {
                                                    item.ai_result
                                                }
                                            </Badge>

                                        </Table.Cell>

                                        <Table.Cell>

                                            <Badge
                                                colorPalette={
                                                    item.human_result ===
                                                    "Pass"
                                                        ? "green"
                                                        : "red"
                                                }
                                            >
                                                {
                                                    item.human_result
                                                }
                                            </Badge>

                                        </Table.Cell>

                                        <Table.Cell>

                                            <Badge
                                                colorPalette={getValidationColor(
                                                    item.validation_type
                                                )}
                                            >
                                                {
                                                    item.validation_type
                                                }
                                            </Badge>

                                        </Table.Cell>

                                        <Table.Cell>

                                            <Badge
                                                colorPalette={getSeverityColor(
                                                    item.severity
                                                )}
                                            >
                                                {
                                                    item.severity
                                                }
                                            </Badge>

                                        </Table.Cell>

                                        <Table.Cell>
                                            {
                                                item.failure_category
                                            }
                                        </Table.Cell>

                                        <Table.Cell
                                            maxW="250px"
                                        >
                                            {
                                                item.reviewer_comment
                                            }
                                        </Table.Cell>

                                    </Table.Row>

                                )
                            )}

                        </Table.Body>

                    </Table.Root>

                )}

            </Card.Body>

        </Card.Root>
    );
}