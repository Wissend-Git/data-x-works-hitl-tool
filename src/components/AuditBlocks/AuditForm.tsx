"use client";

import { useEffect, useState } from "react";

import {
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Input,
    NativeSelect,
    Progress,
    RadioGroup,
    Select,
    Stack,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";

import {
    buildAuditPayload,
    getFailureCategories,
    getSeverityColor,
    getSeverityFromChecklist,
    isAlreadyAudited,
    validateAuditForm,
} from "./AuditHelpers";

import { toaster } from "@/components/ui/toaster";

interface AuditFormProps {
    assignedAudits: any[];
    auditResults: any[];
    setAuditResults: React.Dispatch<
        React.SetStateAction<any[]>
    >;
    user: any;
}

export default function AuditForm({
    assignedAudits,
    auditResults,
    setAuditResults,
    user,
}: AuditFormProps) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [failureOptions, setFailureOptions] = useState<any[]>([]);

    const [formData, setFormData] =
        useState<any>({
            human_result: "",
            failure_category: "",
            severity: "",
            actual_value: "",
            expected_value: "",
            reviewer_comment: "",
        });

    const [saving, setSaving] = useState(false);

    
    useEffect(() => {
        
        try {
            
            const saved =
            localStorage.getItem(
                    "auditResults"
                );

                if (saved) {

                    setAuditResults(
                    JSON.parse(saved)
                );

            }
            
        } catch (error) {

            console.error(error);
            
        }
        
    }, []);
    
    const currentAudit = assignedAudits[currentIndex];
    
    useEffect(() => {

        if (
            !currentAudit ||
            formData.human_result !== "Fail"
        ) {
            return;
        }

        const categories =
            getFailureCategories(
                currentAudit.project_name,
                currentAudit.audit_core,
                currentAudit.category_name
            );

        setFailureOptions(categories);

    }, [
        currentAudit,
        formData.human_result,
    ]);

    useEffect(() => {

        if (!currentAudit) return;

        const existingAudit =
            auditResults.find(
                (item) =>
                    item.url ===
                    currentAudit.url
            );

        if (existingAudit) {

            setFormData({
                human_result:
                    existingAudit.human_result,
                failure_category:
                    existingAudit.failure_category ===
                        "N/A"
                        ? ""
                        : existingAudit.failure_category,
                severity:
                    existingAudit.severity ===
                        "N/A"
                        ? ""
                        : existingAudit.severity,
                actual_value:
                    existingAudit.actual_value,
                expected_value:
                    existingAudit.expected_value,
                reviewer_comment:
                    existingAudit.reviewer_comment,
            });

        } else {

            resetForm();

        }

    }, [
        currentIndex
    ]);

    const resetForm = () => {

        setFormData({
            human_result: "",
            failure_category: "",
            severity: "",
            actual_value: "",
            expected_value: "",
            reviewer_comment: "",
        });

        setFailureOptions([]);
    };

    const handleFailureCategoryChange = (
        value: string
    ) => {

        const severity =
            getSeverityFromChecklist(
                currentAudit.project_name,
                currentAudit.audit_core,
                currentAudit.category_name,
                value
            );

        setFormData((prev: any) => ({
            ...prev,
            failure_category: value,
            severity,
        }));
    };

    // const handleFinalSubmit = async () => {

    //     if (
    //         auditResults.length !==
    //         assignedAudits.length
    //     ) {

    //         toaster.create({
    //             title:
    //                 "Please audit all products before submitting",
    //             type: "warning",
    //         });

    //         return;
    //     }

    //     try {

    //         const response = await fetch(
    //             "/api/save-audit",
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type":
    //                         "application/json",
    //                 },
    //                 body: JSON.stringify(
    //                     auditResults
    //                 ),
    //             }
    //         );

    //         const result =
    //             await response.json();

    //         if (result.success) {

    //             toaster.create({
    //                 title:
    //                     "Audit file generated successfully",
    //                 type: "success",
    //             });

    //         }

    //     } catch (error) {

    //         toaster.create({
    //             title:
    //                 "Failed to save audit file",
    //             type: "error",
    //         });

    //     }
    // };

    const handleFinalSubmit = async () => {

        if (
            auditResults.length !==
            assignedAudits.length
        ) {

            toaster.create({
                title:
                    "Please audit all products before submitting",
                type: "warning",
            });

            return;

        }

        try {

            localStorage.setItem(
                "auditResults",
                JSON.stringify(auditResults)
            );

            toaster.create({
                title:
                    "Audit submitted successfully",
                type: "success",
            });

        } catch (error) {

            console.error(error);

            toaster.create({
                title:
                    "Failed to save audit",
                type: "error",
            });

        }

    };

    const handleSaveAudit = async (
        moveNext = false
    ) => {

        if (!currentAudit || saving) return;

        const validation =
            validateAuditForm(formData);

        if (!validation.isValid) {

            validation.errors.forEach(
                (error) => {

                    toaster.create({
                        title: error,
                        type: "error",
                    });

                }
            );

            return;
        }

        try {

            setSaving(true);

            const payload =
                buildAuditPayload(
                    currentAudit,
                    formData,
                    user
                );

            // setAuditResults((prev) => {

            //     const existingIndex =
            //         prev.findIndex(
            //             (item) =>
            //                 item.url ===
            //                 currentAudit.url
            //         );

            //     if (existingIndex >= 0) {

            //         const updated = [...prev];

            //         updated[existingIndex] =
            //             payload;

            //         return updated;
            //     }

            //     return [
            //         ...prev,
            //         payload,
            //     ];
            // });

            setAuditResults((prev) => {

                let updated;

                const existingIndex =
                    prev.findIndex(
                        (item) =>
                            item.url ===
                            currentAudit.url
                    );

                if (existingIndex >= 0) {

                    updated = [...prev];

                    updated[existingIndex] =
                        payload;

                } else {

                    updated = [
                        ...prev,
                        payload,
                    ];

                }

                localStorage.setItem(
                    "auditResults",
                    JSON.stringify(updated)
                );

                return updated;

            });

            toaster.create({
                title: "Audit saved",
                type: "success",
            });

            if (moveNext) {

                setTimeout(() => {

                    setCurrentIndex(
                        (prev) =>
                            Math.min(
                                prev + 1,
                                assignedAudits.length - 1
                            )
                    );

                }, 100);
            }

        } finally {

            setSaving(false);

        }
    };

    if (!currentAudit) {

        return (
            <Card.Root>
                <Card.Body py={10}>
                    <Text
                        textAlign="center"
                        fontWeight="bold"
                    >
                        No Assigned Audits
                    </Text>
                </Card.Body>
            </Card.Root>
        );
    }

    const completedCount =
        new Set(
            auditResults.map(
                (item) => item.url
            )
        ).size;

    const progress =
        assignedAudits.length === 0
            ? 0
            : Math.round(
                (completedCount /
                    assignedAudits.length) *
                100
            );

    return (
        <Card.Root shadow="md">

            <Card.Header>

                <Flex
                    justify="space-between"
                    align="center"
                >

                    <Heading size="md">
                        Audit Management
                    </Heading>

                    <Text
                        fontWeight="bold"
                    >
                        {auditResults.length}
                        /
                        {
                            assignedAudits.length
                        }
                    </Text>

                </Flex>

                <Progress.Root
                    value={progress}
                    size="md"
                >
                    <Progress.Track>
                        <Progress.Range />
                    </Progress.Track>
                </Progress.Root>

            </Card.Header>

            <Card.Body>

                <VStack
                    gap={5}
                    align="stretch"
                >

                    {/* URL */}

                    <Box>

                        <Text
                            fontWeight="bold"
                            mb={1}
                        >
                            URL
                        </Text>

                        <Text
                            color="blue.600"
                            wordBreak="break-all"
                        >
                            {
                                currentAudit.url
                            }
                        </Text>

                    </Box>

                    {/* AI Result */}

                    <Box>

                        <Text
                            mb={2}
                            fontWeight="bold"
                        >
                            AI Result
                        </Text>

                        <Badge
                            colorPalette={
                                currentAudit.ai_result ===
                                    "Pass"
                                    ? "green"
                                    : "red"
                            }
                            size="lg"
                        >
                            {
                                currentAudit.ai_result
                            }
                        </Badge>

                    </Box>

                    {/* Human Result */}

                    <Box>

                        <Text
                            mb={2}
                            fontWeight="bold"
                        >
                            Human Result
                        </Text>

                        <RadioGroup.Root
                            value={
                                formData.human_result
                            }
                            onValueChange={(
                                details
                            ) => {

                                setFormData(
                                    (
                                        prev: any
                                    ) => ({
                                        ...prev,
                                        human_result:
                                            details.value,
                                    })
                                );

                            }}
                        >

                            <Stack
                                direction="row"
                            >

                                <RadioGroup.Item value="Pass">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>
                                        Pass
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>

                                <RadioGroup.Item value="Fail">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>
                                        Fail
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>

                            </Stack>

                        </RadioGroup.Root>

                    </Box>

                    {/* FAIL SECTION */}

                    {formData.human_result ===
                        "Fail" && (
                            <>
                                <Box>

                                    <Text
                                        mb={2}
                                        fontWeight="bold"
                                    >
                                        Failure Category
                                    </Text>

                                    <NativeSelect.Root>

                                        <NativeSelect.Field
                                            placeholder="Select Failure Category"
                                            value={
                                                formData.failure_category
                                            }
                                            onChange={(e) =>
                                                handleFailureCategoryChange(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            {failureOptions.map(
                                                (item) => (
                                                    <option
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </option>
                                                )
                                            )}

                                        </NativeSelect.Field>

                                        <NativeSelect.Indicator />

                                    </NativeSelect.Root>

                                </Box>

                                {formData.severity && (
                                    <Box>

                                        <Text
                                            mb={2}
                                            fontWeight="bold"
                                        >
                                            Severity
                                        </Text>

                                        <Badge
                                            colorPalette={
                                                getSeverityColor(
                                                    formData.severity
                                                )
                                            }
                                        >
                                            {
                                                formData.severity
                                            }
                                        </Badge>

                                    </Box>
                                )}

                                <Input
                                    placeholder="Actual Value"
                                    value={
                                        formData.actual_value
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setFormData(
                                            (
                                                prev: any
                                            ) => ({
                                                ...prev,
                                                actual_value:
                                                    e
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                />

                                <Input
                                    placeholder="Expected Value"
                                    value={
                                        formData.expected_value
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setFormData(
                                            (
                                                prev: any
                                            ) => ({
                                                ...prev,
                                                expected_value:
                                                    e
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                />

                                <Textarea
                                    placeholder="Reviewer Comment"
                                    value={
                                        formData.reviewer_comment
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setFormData(
                                            (
                                                prev: any
                                            ) => ({
                                                ...prev,
                                                reviewer_comment:
                                                    e
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                />
                            </>
                        )}

                    {/* Navigation */}

                    <Flex
                        justify="space-between"
                        mt={4}
                    >

                        <Button
                            variant="outline"
                            onClick={() => {

                                if (saving) return;

                                setCurrentIndex(
                                    (prev) =>
                                        Math.max(
                                            0,
                                            prev - 1
                                        )
                                );

                            }}
                            disabled={
                                currentIndex === 0
                            }
                        >
                            Previous
                        </Button>

                        <Flex gap={3}>

                            {currentIndex === assignedAudits.length - 1 ? (
                                <Button
                                    colorPalette="blue"
                                    loading={saving}
                                    onClick={async () => {

                                        await handleSaveAudit(false);
                                        await handleFinalSubmit();

                                    }}
                                >
                                    Submit Audit
                                </Button>
                            ) : (
                                <Button
                                    colorPalette="green"
                                    loading={saving}
                                    onClick={() =>
                                        handleSaveAudit(true)
                                    }
                                >
                                    Save & Next
                                </Button>
                            )}

                        </Flex>

                    </Flex>

                </VStack>

            </Card.Body>

        </Card.Root>
    );
}