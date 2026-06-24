"use client";

import {
    Box,
    Card,
    Heading,
    NativeSelect,
    SimpleGrid,
    Text,
    VStack,
    Badge,
    Separator,
    Button
} from "@chakra-ui/react";

import criteria from "@/data/outputs/criteria_output.json";
import { useMemo, useState } from "react";
import ChecklistCard from "./ChecklistCard";

export default function ChecklistManagement() {

    const [project, setProject] = useState("");
    const [auditCore, setAuditCore] = useState("");
    const [category, setCategory] = useState("");

    const projects = [
        ...new Set(criteria.map((x: any) => x.project_name))
    ];

    const auditCores = [
        ...new Set(
            criteria
                .filter(
                    (x: any) =>
                        !project ||
                        x.project_name === project
                )
                .map((x: any) => x.audit_core)
        )
    ];

    const categories = [
        ...new Set(
            criteria
                .filter(
                    (x: any) =>
                        (!project ||
                            x.project_name === project) &&
                        (!auditCore ||
                            x.audit_core === auditCore)
                )
                .map((x: any) => x.category_name)
        )
    ];

    const filtered = useMemo(() => {

        return criteria.filter(
            (x: any) =>
                (!project ||
                    x.project_name === project) &&
                (!auditCore ||
                    x.audit_core === auditCore) &&
                (!category ||
                    x.category_name === category)
        );

    }, [
        project,
        auditCore,
        category
    ]);

    return (
        <Card.Root>
            <Card.Header>
                <Heading size={"md"} color="#1d2a44">
                    Checklist Management
                </Heading>
            </Card.Header>

            <Card.Body>

                <SimpleGrid
                    columns={5}
                    gap={4}
                    mb={5}
                >
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={project}
                            onChange={(e) =>
                                setProject(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                All Projects
                            </option>

                            {projects && projects.map((p, ind) => (
                                <option
                                    key={`${p}-${ind}`}
                                    value={p}
                                >
                                    {p}
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
                                All Audit Core
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
                            value={category}
                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                All Category
                            </option>

                            {categories && categories.map(
                                (item, index) => (
                                    <option
                                        key={`${item}-${index}`}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )
                            )}
                        </NativeSelect.Field>
                    </NativeSelect.Root>

                </SimpleGrid>

                {filtered.map(
                    (checklist: any, idx) => (
                            <Box
                                key={`${checklist.project_name}-${checklist.audit_core}-${checklist.category_name}-${idx}`}
                                my={6}
                            >

                                <Heading
                                    size="md"
                                    fontWeight={600}
                                    textStyle="1xl"
                                    ml="3"
                                    mb={1}
                                >
                                    {checklist.project_name}
                                </Heading>

                                <Text
                                    color={"#666"}
                                    ml="3"
                                    mb={3}
                                    fontSize={"sm"}
                                >
                                    {checklist.audit_core}
                                </Text>

                                <SimpleGrid
                                    columns={4}
                                    gap={4}
                                >

                                    {checklist.audit_checks.map(
                                        (
                                            check: any,
                                            index: number
                                        ) => (
                                            <ChecklistCard
                                                key={`${check.check_name}-${index}`}
                                                check={check}
                                            />
                                        )
                                    )}

                                </SimpleGrid>

                            </Box>
                    )
                )}

            </Card.Body>
        </Card.Root>
    );
}