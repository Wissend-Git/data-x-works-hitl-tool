"use client";

import {
    Card,
    Checkbox,
    Table,
    Badge,
    Heading,
    Text
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";


export function EllipsisCell({
    text,
}: {
    text: string;
}) {
    return (
        <Tooltip
            content={text}
            positioning={{ placement: "top" }}
            openDelay={300}
        >
            <Text
                maxW="100%"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                cursor="pointer"
            >
                {text || "-"}
            </Text>
        </Tooltip>
    );
}

export default function CheckListTable({
    title,
    data,
    setData,
    variant
}: any) {

    return (
        <Card.Root>

            <Card.Header
                bg={variant === "default" ? "blue.100" : "green.100"}
                color={variant === "default" ? "#1D2A44" : "green"}
                px={5} py={3}
            >
                <Heading color="#1D2A44">{title}</Heading>
            </Card.Header>

            <Card.Body>

                <Table.Root
                    size="sm"
                    variant="outline"
                    tableLayout="fixed"
                    borderRadius="md"
                    >

                    <Table.Header
                        position="sticky"
                        top={0}
                        zIndex={2}
                    >
                        <Table.Row bg="#1d2a44" color="#fff">

                            <Table.ColumnHeader w="3%" borderTopLeftRadius={"md"}/>
                            <Table.ColumnHeader color="#fff" w="12%">Failed Check List</Table.ColumnHeader>
                            <Table.ColumnHeader color="#fff" w="14%">Failed Category Description</Table.ColumnHeader>
                            <Table.ColumnHeader color="#fff" w="14%">Pass Criteria</Table.ColumnHeader>
                            <Table.ColumnHeader color="#fff" w="7%">Severity</Table.ColumnHeader>
                            <Table.ColumnHeader color="#fff" w="14%">Sample Pass</Table.ColumnHeader>
                            <Table.ColumnHeader color="#fff" w="15%">Sample Fail</Table.ColumnHeader>
                            <Table.ColumnHeader color="#fff" w="15%" borderTopRightRadius={"md"}>Notes</Table.ColumnHeader>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.map(
                            (
                                item: any,
                                index: number
                            ) => (
                                <Table.Row
                                    key={index}
                                    _hover={{
                                        bg: "gray.50"
                                    }}
                                >
                                    <Table.Cell
                                        textAlign={"center"}
                                    >
                                        <Checkbox.Root
                                            checked={item.selected}
                                            onCheckedChange={(e) => {

                                                const copy = [...data];

                                                copy[index].selected =
                                                    e.checked === true;

                                                setData(copy);
                                            }}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                        </Checkbox.Root>
                                    </Table.Cell>

                                    <Table.Cell>{item.check_name}</Table.Cell>
                                    <Table.Cell>{item.description}</Table.Cell>
                                    <Table.Cell>{item.pass_criteria}</Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            minW="80px"
                                            justifyContent="center"
                                            borderRadius="full"
                                            px={3}
                                            py={1}
                                            colorPalette={
                                                item.severity === "Critical"
                                                    ? "red"
                                                    : item.severity === "Major"
                                                        ? "orange"
                                                        : "green"
                                            }
                                        >
                                            {item.severity}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>{item.example_pass}</Table.Cell>
                                    <Table.Cell>{item.example_fail}</Table.Cell>
                                    <Table.Cell>{item.notes}</Table.Cell>
                                </Table.Row>
                            )
                        )}

                    </Table.Body>

                </Table.Root>

            </Card.Body>

        </Card.Root>
    );
}