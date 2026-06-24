"use client";

import {
    Button,
    Card,
    Checkbox,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Input,
    NativeSelect,
    Progress,
    SimpleGrid,
    Stack,
    Text,
    VStack
} from "@chakra-ui/react";

import users from "@/data/credentials.json";
import auditData from "@/data/client/input/client_sample_audit_input.json";
import criteria from "@/data/outputs/criteria_output.json";
import AssignmentPreview from "./AssignmentPreview";

import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export default function AuditAssignmentManagement() {

    const router = useRouter();

    const [projectName, setProjectName] = useState("");
    const [auditCore, setAuditCore] = useState("");
    const [categoryName, setCategoryName] = useState("");

    const [showPreview, setShowPreview] = useState(false);
    const [previewAssignments, setPreviewAssignments] = useState<any[]>([]);

    const projects = [
        ...new Set(
            criteria.map(
                (item: any) => item.project_name
            )
        )
    ];

    const auditCores = [
        ...new Set(
            criteria
                .filter(
                    (item: any) =>
                        item.project_name === projectName
                )
                .map(
                    (item: any) => item.audit_core
                )
        )
    ];

    const categories = [
        ...new Set(
            criteria
                .filter(
                    (item: any) =>
                        item.project_name === projectName &&
                        item.audit_core === auditCore
                )
                .map(
                    (item: any) => item.category_name
                )
        )
    ];

    const selectedChecklist =
        criteria.find(
            (item: any) =>
                item.project_name === projectName &&
                item.audit_core === auditCore &&
                item.category_name === categoryName
        );

    const handlePreview = () => {

        if (!projectName) {
            toaster.create({
                title: "Select Project",
                type: "error"
            });
            return;
        }

        if (!auditCore) {
            toaster.create({
                title: "Select Audit Core",
                type: "error"
            });
            return;
        }

        if (!categoryName) {
            toaster.create({
                title: "Select Category",
                type: "error"
            });
            return;
        }

        if (!selectedUsers.length) {
            toaster.create({
                title: "Select Users",
                type: "error"
            });
            return;
        }

        const sampleCount = Math.ceil(
            (Number(sampling) / 100) *
            auditData.length
        );

        const shuffled =
            [...auditData].sort(
                () => Math.random() - 0.5
            );

        const sampled =
            shuffled.slice(
                0,
                sampleCount
            );

        const assignments =
            sampled.map(
                (item, index) => ({
                    project_name:
                        projectName,

                    audit_core:
                        auditCore,

                    category_name:
                        categoryName,

                    url:
                        item.url,

                    ai_result:
                        item.ai_result,

                    user:
                        selectedUsers[
                        index %
                        selectedUsers.length
                        ]
                })
            );

        setPreviewAssignments(
            assignments
        );

        setShowPreview(true);

        toaster.create({
            title:
                "Preview Generated",
            type: "success"
        });
    };

    const auditUsers =
        users.filter(
            (x: any) =>
                x.role === "user"
        );

    const [selectedUsers, setSelectedUsers] =
        useState<string[]>([]);

    const [sampling, setSampling] =
        useState("80");

    const total =
        auditData.length;

    const pass =
        auditData.filter(
            (x: any) =>
                x.ai_result
                    .toLowerCase() ===
                "pass"
        ).length;

    const fail =
        total - pass;

    const sampleCount = Math.ceil(
        (Number(sampling) / 100) *
        auditData.length
    );

    const shuffled = [...auditData].sort(
        () => Math.random() - 0.5
    );

    const sample = shuffled.slice(
        0,
        sampleCount
    );

    const preview = sample.map(
        (item, index) => ({
            ...item,
            user:
                selectedUsers[
                index %
                selectedUsers.length
                ]
        })
    );

    useEffect(() => {
        setPreviewAssignments(preview);
    }, []);

    const handleAssign =
        async () => {

            if (
                !selectedUsers.length
            ) {
                toaster.create({
                    title:
                        "Select users",
                    type: "error"
                });

                return;
            }

            const res =
                await fetch(
                    "/api/assign-audit",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            {
                                users:
                                    selectedUsers,

                                sampling:
                                    Number(
                                        sampling
                                    ),

                                checklist: selectedChecklist
                            }
                        )
                    }
                );

            const data =
                await res.json();

            if (
                data.success
            ) {
                toaster.create({
                    title:
                        "Assigned Successfully",
                    type: "success"
                });
            }
        };

    return (
        <Card.Root>

            <Card.Header>
                <Heading size={"md"}>
                    Audit Assignment Management
                </Heading>
            </Card.Header>

            <Card.Body>

                <Grid
                    templateColumns="repeat(3,1fr)"
                    gap={4}
                    mb={6}
                >

                    <Card.Root>
                        <Card.Body>
                            <Stack flexDir={"row"} gap={4} justifyContent={"space-evenly"}>
                                <Flex flexDir={"column"} bg={"#F1D5D2"} w={"150px"} px="3" py="2" borderRadius={"md"} alignItems={"center"}>
                                    <Text fontSize={"sm"} color={"#333"}>
                                        Total Products
                                    </Text>
                                    <Heading fontSize={"2xl"} color={"#333"}>
                                        {total}
                                    </Heading>
                                </Flex>

                                <Flex flexDir={"column"} bg={"green.50"} w={"150px"} px="3" py="2" borderRadius={"md"} alignItems={"center"}>
                                    <Text fontSize={"sm"} color={"green"}>
                                        Pass
                                    </Text>
                                    <Heading fontSize={"2xl"} color={"green"}>
                                        {pass}
                                    </Heading>
                                </Flex>

                                <Flex flexDir={"column"} bg={"red.50"} w={"150px"} px="3" py="2" borderRadius={"md"} alignItems={"center"}>
                                    <Text fontSize={"sm"} color={"red"}>
                                        Fail
                                    </Text>
                                    <Heading fontSize={"2xl"} color={"red"}>
                                        {fail}
                                    </Heading>
                                </Flex>

                            </Stack>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root>
                        <Card.Body>
                            <Stack flexDir={"row"} gap={4} justifyContent={"space-evenly"}>
                                <Flex flexDir={"column"} w={"full"} px="3" py="2" borderRadius={"md"} alignItems={"center"}>
                                    <Text fontSize={"sm"} color={"teal"} mb="2">
                                        AI Quality pass
                                    </Text>

                                    <Progress.Root
                                        defaultValue={(
                                            (pass /
                                                total) *
                                            100
                                        )}
                                        w="full"
                                        borderRadius={"lg"}
                                        size={"lg"}
                                        colorPalette={"teal"}
                                        variant="subtle"
                                    >
                                        <HStack gap="5">
                                            <Progress.Track flex="1">
                                                <Progress.Range />
                                            </Progress.Track>
                                            <Progress.ValueText color={"teal"}>{(
                                                (pass /
                                                    total) *
                                                100
                                            ).toFixed(
                                                1
                                            )}
                                                %</Progress.ValueText>
                                        </HStack>
                                    </Progress.Root>
                                </Flex>
                            </Stack>
                        </Card.Body>
                    </Card.Root>

                    <GridItem justifySelf={"end"}>
                        <Button
                            p={"5px 10px"}
                            size="sm"
                            bg="#1d2a44"
                            color={"#fff"}
                            borderRadius="md"
                            cursor={"pointer"}
                            _hover={{bg:"lightblue", color: "#1d2a44"}}
                            onClick={() => router.push("/ai_summary")}
                        >
                            AI Summary
                        </Button>
                    </GridItem>

                </Grid>

                <SimpleGrid
                    columns={3}
                    gap={4}
                    mb={6}
                >

                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={projectName}
                            onChange={(e) =>
                                setProjectName(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Project
                            </option>

                            {projects && projects.map((item, index) => (
                                <option
                                    key={`${item}-${index}`}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </NativeSelect.Field>
                    </NativeSelect.Root>

                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={auditCore}
                            onChange={(e) =>
                                setAuditCore(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Audit Core
                            </option>

                            {auditCores && auditCores.map((item, index) => (
                                <option
                                    key={`${item}-${index}`}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </NativeSelect.Field>
                    </NativeSelect.Root>

                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={categoryName}
                            onChange={(e) =>
                                setCategoryName(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Category
                            </option>

                            {categories && categories.map((item, index) => (
                                <option
                                    key={`${item}-${index}`}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </NativeSelect.Field>
                    </NativeSelect.Root>

                </SimpleGrid>

                <Heading
                    size={"sm"}
                    mb={4}
                >
                    Select Users
                </Heading>

                <VStack
                    align={"start"}
                    mb={5}
                >

                    {auditUsers.map(
                        (
                            user: any,
                            index: number
                        ) => (

                            <Checkbox.Root
                                key={`${user.emp_id}-${index}`}
                                checked={selectedUsers.includes(
                                    user.emp_id
                                )}
                                onCheckedChange={(details) => {

                                    const checked = details.checked;

                                    if (checked) {

                                        setSelectedUsers(prev => [
                                            ...prev,
                                            user.emp_id
                                        ]);

                                    } else {

                                        setSelectedUsers(prev =>
                                            prev.filter(
                                                x => x !== user.emp_id
                                            )
                                        );

                                    }

                                }}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>
                                    {
                                        user.name
                                    }
                                </Checkbox.Label>
                            </Checkbox.Root>
                        )
                    )}

                </VStack>

                <Input
                    placeholder="Sampling %"
                    value={sampling}
                    onChange={(e) =>
                        setSampling(
                            e.target.value
                        )
                    }
                    mb={4}
                />

                {selectedChecklist && (

                    <Card.Root mb={5}>
                        <Card.Body>

                            <Heading size="sm" mb={3}>
                                Selected Checklist
                            </Heading>

                            <Text>
                                Project :
                                {" "}
                                {selectedChecklist.project_name}
                            </Text>

                            <Text>
                                Audit Core :
                                {" "}
                                {selectedChecklist.audit_core}
                            </Text>

                            <Text>
                                Category :
                                {" "}
                                {selectedChecklist.category_name}
                            </Text>

                            <Text mt={2}>
                                Checks :
                                {" "}
                                {selectedChecklist.audit_checks.length}
                            </Text>

                        </Card.Body>
                    </Card.Root>

                )}

                <HStack mt={4}>

                    <Button
                        colorPalette="orange"
                        onClick={handlePreview}
                    >
                        Generate Preview
                    </Button>

                    {showPreview && (
                        <Button
                            colorPalette="blue"
                            onClick={handleAssign}
                        >
                            Assign Audit
                        </Button>
                    )}

                </HStack>

            </Card.Body>

            {showPreview &&
                previewAssignments.length > 0 && (

                    <AssignmentPreview
                        assignments={
                            previewAssignments
                        }
                    />

                )}

        </Card.Root>
    );
}