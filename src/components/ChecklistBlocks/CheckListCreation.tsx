"use client";

import {
    Alert,
    Button,
    Card,
    Grid,
    Heading,
    Input,
    NativeSelect,
    Textarea,
} from "@chakra-ui/react";

import { useState } from "react";

export default function CheckListCreation({
    category,
    setClientChecks
}: any) {

    const [data, setData] = useState({
        check_name: "",
        description: "",
        pass_criteria: "",
        severity: "",
        example_pass: "",
        example_fail: "",
        notes: ""
    });

    const severity_list = ["Major", "Minor", "Critical"]


    const [error, setError] = useState("");

    const isFormValid =
        data.check_name.trim() !== "" &&
        data.severity.trim() !== "" &&
        data.pass_criteria.trim() !== "" &&
        data.example_pass.trim() !== "" &&
        data.example_fail.trim() !== "";

    const addChecklist = () => {

        if (!isFormValid) {
            setError(
                "Please fill all required fields: Checklist Name, Severity, Pass Criteria, Example Pass, and Example Fail."
            );
            return;
        }

        setError("");

        const newItem = {
            source: "Client",
            category,
            ...data,
            selected: true
        };

        setClientChecks((prev: any) => [
            ...prev,
            newItem
        ]);

        setData({
            check_name: "",
            description: "",
            pass_criteria: "",
            severity: "",
            example_pass: "",
            example_fail: "",
            notes: ""
        });
    };

    return (
        <Card.Root>

            <Card.Header
                px={5} py={3}
            >
                <Heading color={"#1d2a44"}>Create New Checklist</Heading>
            </Card.Header>

            <Card.Body>

                {error && (
                    <Alert.Root status="error" mb={4}>
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Validation Error</Alert.Title>
                            <Alert.Description>
                                {error}
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root>
                )}

                <Grid
                    templateColumns="repeat(2,1fr)"
                    gap={4}
                >

                    <Input
                        placeholder="Checklist Name *"
                        value={data.check_name}
                        onChange={(e) =>
                            setData({
                                ...data,
                                check_name: e.target.value
                            })
                        }
                    />

                    <NativeSelect.Root>
                        <NativeSelect.Field
                            color={"#9ca3af"}
                            value={data.severity}
                            placeholder="Severity *"
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    severity: e.target.value
                                })
                            }
                        >
                            {severity_list.map((svlist, index) => (
                                <option
                                    key={`${svlist}-${index}`}
                                    value={svlist}
                                >{svlist}</option>
                            ))}
                        </NativeSelect.Field>
                    </NativeSelect.Root>

                    <Textarea
                        placeholder="Description"
                        value={data.description}
                        onChange={(e) =>
                            setData({
                                ...data,
                                description: e.target.value
                            })
                        }
                    />

                    <Textarea
                        placeholder="Pass Criteria *"
                        value={data.pass_criteria}
                        onChange={(e) =>
                            setData({
                                ...data,
                                pass_criteria: e.target.value
                            })
                        }
                    />

                    <Input
                        placeholder="Example Pass *"
                        value={data.example_pass}
                        onChange={(e) =>
                            setData({
                                ...data,
                                example_pass: e.target.value
                            })
                        }
                    />

                    <Input
                        placeholder="Example Fail *"
                        value={data.example_fail}
                        onChange={(e) =>
                            setData({
                                ...data,
                                example_fail: e.target.value
                            })
                        }
                    />

                    <Textarea
                        placeholder="Notes"
                        value={data.notes}
                        onChange={(e) =>
                            setData({
                                ...data,
                                notes: e.target.value
                            })
                        }
                    />

                </Grid>

                <Button
                    w="30%"
                    mt={4}
                    colorPalette="green"
                    onClick={addChecklist}
                    disabled={!isFormValid}
                >
                    Add Checklist
                </Button>

            </Card.Body>

        </Card.Root>
    );
}