export interface AuditRowType {
    Attribute: string;
    "Source Value": string | null;
    "Extracted Value": string | null;

    reviewerStatus: "" | "pass" | "fail";

    failureCategory: string;
    correctedValue: string;
    sourceEvidence: string;
    comments: string;
}

export interface ChecklistItem {
    source: "Default" | "Client";
    category: string;
    check_name: string;
    description: string;
    pass_criteria: string;
    severity: string;
    example_pass: string;
    example_fail: string;
    notes: string;
    selected?: boolean;
}

export interface CriteriaFormData {
    project_name: string;
    audit_core: string;
    core_description: string;
    category_name: string;
}