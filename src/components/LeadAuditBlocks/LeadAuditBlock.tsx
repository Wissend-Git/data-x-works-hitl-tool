"use client";

import {
    Box,
    Heading,
    VStack
} from "@chakra-ui/react";

import ChecklistManagement from "@/components/LeadAuditBlocks/ChecklistManagement";
import AuditAssignmentManagement from "@/components/LeadAuditBlocks/AuditAssignmentManagement";

export default function LeadAuditPage() {

    return (
        <Box p={6}>
            <Heading
                textAlign={"center"}
                mb={8}
            >
                Management & Organizing
            </Heading>

            <VStack gap={8} align={"stretch"}>
                <ChecklistManagement />
                <AuditAssignmentManagement />
            </VStack>
        </Box>
    );
}