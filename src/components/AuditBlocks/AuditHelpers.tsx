import criteriaData from "@/data/outputs/criteria_output.json";

/* ----------------------------------
   Validation Type
----------------------------------- */

export const calculateValidationType = (
    aiResult: string,
    humanResult: string
) => {

    if (
        aiResult === "Fail" &&
        humanResult === "Fail"
    ) {
        return "TP";
    }

    if (
        aiResult === "Fail" &&
        humanResult === "Pass"
    ) {
        return "FP";
    }

    if (
        aiResult === "Pass" &&
        humanResult === "Fail"
    ) {
        return "FN";
    }

    return "TN";
};

/* ----------------------------------
   Find Matching Criteria
----------------------------------- */

export const getMatchingCriteria = (
    projectName: string,
    auditCore: string,
    categoryName: string
) => {

    const criteria = criteriaData.find(
        (item: any) =>
            item.project_name === projectName &&
            item.audit_core === auditCore &&
            item.category_name === categoryName
    );

    return criteria || null;
};

/* ----------------------------------
   Get Failure Categories
----------------------------------- */

export const getFailureCategories = (
    projectName: string,
    auditCore: string,
    categoryName: string
) => {

    const criteria = getMatchingCriteria(
        projectName,
        auditCore,
        categoryName
    );

    if (!criteria) {
        return [];
    }

    return (
        criteria.audit_checks?.map(
            (check: any) => ({
                label: check.check_name,
                value: check.check_name,
                severity: check.severity,
                description: check.description,
                pass_criteria: check.pass_criteria,
            })
        ) || []
    );
};

/* ----------------------------------
   Get Severity
----------------------------------- */

export const getSeverityFromChecklist = (
    projectName: string,
    auditCore: string,
    categoryName: string,
    checklistName: string
) => {

    const criteria = getMatchingCriteria(
        projectName,
        auditCore,
        categoryName
    );

    if (!criteria) {
        return "";
    }

    const selectedCheck =
        criteria.audit_checks.find(
            (check: any) =>
                check.check_name === checklistName
        );

    return selectedCheck?.severity || "";
};

/* ----------------------------------
   Severity Badge Color
----------------------------------- */

export const getSeverityColor = (
    severity: string
) => {

    switch (severity) {

        case "Critical":
            return "red";

        case "Major":
            return "orange";

        case "Minor":
            return "yellow";

        default:
            return "gray";
    }
};

/* ----------------------------------
   Form Validation
----------------------------------- */

export const validateAuditForm = (
    formData: any
) => {

    const errors: string[] = [];

    if (!formData.human_result) {
        errors.push(
            "Please select Human Result"
        );
    }

    if (
        formData.human_result === "Fail"
    ) {

        if (
            !formData.failure_category
        ) {
            errors.push(
                "Please select Failure Category"
            );
        }

        if (
            !formData.actual_value?.trim()
        ) {
            errors.push(
                "Please enter Actual Value"
            );
        }

        if (
            !formData.expected_value?.trim()
        ) {
            errors.push(
                "Please enter Expected Value"
            );
        }

        if (
            !formData.reviewer_comment?.trim()
        ) {
            errors.push(
                "Please enter Reviewer Comment"
            );
        }
    }

    return {
        isValid:
            errors.length === 0,
        errors,
    };
};

/* ----------------------------------
   Create Audit Payload
----------------------------------- */

export const buildAuditPayload = (
    auditItem: any,
    formData: any,
    user: any
) => {

    const validationType =
        calculateValidationType(
            auditItem.ai_result,
            formData.human_result
        );

    return {

        project_name:
            auditItem.project_name,

        audit_core:
            auditItem.audit_core,

        category_name:
            auditItem.category_name,

        url:
            auditItem.url,

        severity:
            formData.human_result === "Fail"
                ? formData.severity
                : "N/A",

        ai_result:
            auditItem.ai_result,

        human_result:
            formData.human_result,

        validation_type:
            validationType,

        failure_category:
            formData.human_result === "Fail"
                ? formData.failure_category
                : "N/A",

        actual_value:
            formData.actual_value || "",

        expected_value:
            formData.expected_value || "",

        reviewer_comment:
            formData.reviewer_comment || "",

        user:
            user?.emp_id ||
            user?.employee_id ||
            user?.user_id ||
            "",
    };
};

/* ----------------------------------
   Check Already Audited
----------------------------------- */

export const isAlreadyAudited = (
    url: string,
    auditResults: any[]
) => {

    return auditResults.some(
        (item) =>
            item.url === url
    );
};

/* ----------------------------------
   Progress %
----------------------------------- */

export const calculateProgress = (
    completed: number,
    total: number
) => {

    if (!total) {
        return 0;
    }

    return Math.round(
        (completed / total) * 100
    );
};