"use client";

import { Button } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

interface SaveCriteriaProps {
    payload: any;
}

export default function SaveCriteria({
    payload,
}: SaveCriteriaProps) {

    const handleSave = async () => {

        try {

            if (!payload.project_name?.trim()) {
                toaster.create({
                    title: "Project Name is required",
                    type: "error",
                });
                return;
            }

            if (!payload.audit_core?.trim()) {
                toaster.create({
                    title: "Audit Core is required",
                    type: "error",
                });
                return;
            }

            if (!payload.category_name?.trim()) {
                toaster.create({
                    title: "Checklist Category is required",
                    type: "error",
                });
                return;
            }

            if (!payload.audit_checks?.length) {
                toaster.create({
                    title: "At least one checklist must be selected",
                    type: "error",
                });
                return;
            }

            const response = await fetch("/api/criteria", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error("Failed");
            }

            toaster.create({
                title: "Criteria saved successfully",
                type: "success",
            });

        } catch (error) {

            console.error(error);

            toaster.create({
                title: "Failed to save criteria",
                type: "error",
            });
        }
    };

    return (
        <Button
            p={"5px 10px"}
            size="sm"
            bg="#1d2a44"
            color={"#fff"}
            borderRadius="md"
            cursor={"pointer"}
            onClick={handleSave}
        >
            Save Criteria
        </Button>
    );
}