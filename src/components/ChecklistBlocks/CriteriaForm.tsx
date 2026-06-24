"use client";

import {
    Card,
    Grid,
    GridItem,
    Input,
    Text,
    Textarea,
    NativeSelect,
    VStack,
    Box,
    Button,
    Stack,
    Code,
    FileUpload,
    useFileUpload,
} from "@chakra-ui/react";
import { HardDriveUpload } from "lucide-react";
import { toaster } from "@/components/ui/toaster";

interface Props {
    formData: any;
    setFormData: any;
    categories: string[];
    handleCategoryChange: (value: string) => void;
}

const handleFileUpload = async (file: File) => {
    try {
        const allowedTypes = [
            ".csv",
            ".xlsx",
            ".xls",
        ];

        const extension =
            "." + file.name.split(".").pop()?.toLowerCase();

        if (!allowedTypes.includes(extension)) {
            toaster.create({
                title:
                    "Only CSV, XLSX and XLS files are allowed",
                type: "error",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
            "/api/upload-audit-file",
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        toaster.create({
            title: result.message,
            type: "success",
        });
    } catch (error: any) {
        toaster.create({
            title:
                error.message ||
                "File upload failed",
            type: "error",
        });
    }
};

const CustomFileUpload = () => {
    // const fileUpload = useFileUpload({
    //     maxFiles: 1,
    //     maxFileSize: 10 * 1024 * 1024, // 10MB
    //     accept: [
    //         ".csv",
    //         ".xlsx",
    //         ".xls",
    //     ],
    // });

    return (
        <Stack align="flex-start">
            <FileUpload.Root
                maxFiles={1}
                accept={[
                    ".csv",
                    ".xlsx",
                    ".xls",
                ]}
                onFileChange={(details) => {
                    const file =
                        details.acceptedFiles?.[0];

                    if (file) {
                        handleFileUpload(file);
                    }
                }}
                alignItems={"center"}
            >
                <FileUpload.HiddenInput />

                <FileUpload.Trigger asChild>
                    <Button
                        p={"5px 10px"}
                        size="sm"
                        bg="#1d2a44"
                        color="white"
                    >
                        <HardDriveUpload />
                        Upload Audit File
                    </Button>
                </FileUpload.Trigger>

                <Text
                    fontSize="xs"
                    color="gray.500"
                >
                    file formats: .csv, .xlsx, .xls
                </Text>
                <FileUpload.List />
            </FileUpload.Root>

        </Stack>
    );
};

export default function CriteriaForm({
    formData,
    setFormData,
    categories,
    handleCategoryChange,
}: Props) {
    return (
        <Card.Root
            shadow="sm"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
        >
            <Card.Body p={6} flexDir={"row"} gap={4} justifyContent={"space-between"}>
                <Grid
                    gap={5}
                    templateColumns={{
                        base: "1fr",
                        xl: "repeat(3,1fr)",
                    }}
                    w="65%"
                >
                    <GridItem>
                        <VStack align="stretch" gap={2}>
                            <Text
                                fontSize="sm"
                                color="#666"
                                ml="2"
                            >Project Name</Text>

                            <Input
                                size="sm"
                                bg="gray.50"
                                borderRadius="md"
                                border={"1px solid gray.50"}
                                value={formData.project_name}
                                placeholder="Enter Project Name"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        project_name: e.target.value,
                                    })
                                }
                            />
                        </VStack>
                    </GridItem>

                    <GridItem>
                        <VStack align="stretch" gap={2}>
                            <Text
                                fontSize="sm"
                                color="#666"
                                ml="2"
                            >Audit Core</Text>

                            <Input
                                size="sm"
                                bg="gray.50"
                                borderRadius="md"
                                border={"1px solid gray.50"}
                                value={formData.audit_core}
                                placeholder="Enter Audit Core"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        audit_core: e.target.value,
                                    })
                                }
                            />
                        </VStack>
                    </GridItem>

                    <GridItem>
                        <VStack align="stretch" gap={2}>
                            <Text
                                fontSize="sm"
                                color="#666"
                                ml="2"
                            >Checklist Category</Text>

                            <NativeSelect.Root
                                size="sm"
                                bg="gray.50"
                                borderRadius="md"
                                border={"1px solid gray.50"}
                            >
                                <NativeSelect.Field
                                    color={"#9ca3af"}
                                    value={formData.category_name}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">Select Category</option>

                                    {categories.map((cat, index) => (
                                        <option
                                            key={`${cat}-${index}`}
                                            value={cat}
                                        >
                                            {cat}
                                        </option>
                                    ))}
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                        </VStack>
                    </GridItem>

                    <GridItem colSpan={{ base: 1, xl: 3 }}>
                        <VStack align="stretch" gap={2}>
                            <Text
                                fontSize="sm"
                                color="#666"
                                ml="2"
                            >Core Description (Optional)</Text>

                            <Textarea
                                rows={4}
                                size="sm"
                                bg="gray.50"
                                resize="none"
                                height={"3rem"}
                                placeholder="Enter Description..."
                                value={formData.core_description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        core_description:
                                            e.target.value,
                                    })
                                }
                            />
                        </VStack>
                    </GridItem>

                </Grid>
                <Grid
                    gap={5}
                    templateColumns={{
                        base: "1fr",
                        xl: "repeat(2,1fr)",
                    }}
                    flexDir={"row"}
                    alignItems={"flex-end"}
                >
                    <GridItem />
                    <GridItem colSpan={{ base: 1, xl: 1 }}>
                        <CustomFileUpload />
                    </GridItem>
                </Grid>
            </Card.Body>
        </Card.Root>
    );
}