"use client";

import { useState } from "react";
import defaultChecklist from "@/data/default_checklist.json";

import {
    Box,
    Flex,
    Heading,
    VStack,
    Button,
    Text,
    Separator,
} from "@chakra-ui/react";

import CriteriaForm from "@/components/ChecklistBlocks/CriteriaForm";
import CheckListTable from "@/components/ChecklistBlocks/CheckListTable";
import CheckListCreation from "@/components/ChecklistBlocks/CheckListCreation";
import SaveCriteria from "./SaveCriteria";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CriteriaPage() {

    const { user } = useAuth();
    const router = useRouter();

    const clientID = user?.emp_id || `CLI${Date.now()}`;

    const categories = [
        ...new Set(
            defaultChecklist.map(
                (item: any) => item.category
            )
        )
    ];

    const [formData, setFormData] = useState({
        project_name: "",
        audit_core: "",
        core_description: "",
        category_name: ""
    });

    const [defaultChecks, setDefaultChecks] = useState<any[]>([]);
    const [clientChecks, setClientChecks] = useState<any[]>([]);
    const [showCreate, setShowCreate] = useState(false);

    const handleCategoryChange = (category: string) => {

        setFormData(prev => ({
            ...prev,
            category_name: category
        }));

        const filtered = defaultChecklist
            .filter(
                (item: any) =>
                    item.category === category
            )
            .map((item: any) => ({
                ...item,
                selected: true
            }));

        setDefaultChecks(filtered);
    };

    const payload = {
        client_id: clientID,
        project_name: formData.project_name,
        audit_core: formData.audit_core,
        core_description: formData.core_description,
        category_name: formData.category_name,
        audit_checks: [
            ...defaultChecks.filter(item => item.selected),
            ...clientChecks.filter(item => item.selected),
        ],
    };

    const handleClear = () => {
        setFormData({
            project_name: "",
            audit_core: "",
            core_description: "",
            category_name: "",
        });

        setDefaultChecks([]);
        setClientChecks([]);
        setShowCreate(false);
    };

    return (
        <Box p={8}>
            <Flex justify="space-between" mb={5} px="5" flexDir={"row"} alignItems={"center"}>
                <Flex gap={1} m="2" flexDir={"column"} alignContent={"center"}>
                    <Heading color="#1D2A44">Audit Checklist Management</Heading>
                </Flex>
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
            </Flex>



            <VStack gap={6} align="stretch">
                <CriteriaForm
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    handleCategoryChange={
                        handleCategoryChange
                    }
                />
                
                <Separator variant="solid"/>

                <CheckListTable
                    title="Default Checklist"
                    data={defaultChecks}
                    setData={setDefaultChecks}
                    variant="default"
                />

                {showCreate && (
                    <>
                        <CheckListTable
                            title="New Checklist"
                            data={clientChecks}
                            setData={setClientChecks}
                            variant="client"
                        />
                        <CheckListCreation
                            category={
                                formData.category_name
                            }
                            setClientChecks={
                                setClientChecks
                            }
                        />
                    </>
                )}

                {!showCreate && (
                    <Box textAlign="right">
                        <Button
                            onClick={() =>
                                setShowCreate(true)
                            }
                            bg="green.200"
                            color="green"
                            _hover={{ shadow: "sm", bg: "green.100", }}
                        >
                            + Add New Checklist
                        </Button>
                    </Box>
                )}

                {formData.category_name && (
                    <Flex justify="flex-end" gap={2}>
                        <SaveCriteria payload={payload} />
                        <Button
                            p={"5px 10px"}
                            size="sm"
                            border="1px solid #1d2a44"
                            bg="none"
                            color={"#1d2a44"}
                            borderRadius="md"
                            cursor={"pointer"}
                            onClick={handleClear}
                        >Clear</Button>
                    </Flex>
                )}

            </VStack>
        </Box>
    );
}