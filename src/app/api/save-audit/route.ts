import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";

export async function POST(
    request: NextRequest
) {

    try {

        const auditData = await request.json();

        if (
            !auditData ||
            !Array.isArray(auditData)
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid audit data",
                },
                {
                    status: 400,
                }
            );
        }

        const outputDirectory = path.join(
            process.cwd(),
            "src",
            "data",
            "outputs",
            "audit_files"
        );

        if (
            !fs.existsSync(
                outputDirectory
            )
        ) {

            fs.mkdirSync(
                outputDirectory,
                {
                    recursive: true,
                }
            );
        }

        const now = new Date();

        const timestamp =
            `${now.getFullYear()}` +
            `${String(
                now.getMonth() + 1
            ).padStart(2, "0")}` +
            `${String(
                now.getDate()
            ).padStart(2, "0")}_` +
            `${String(
                now.getHours()
            ).padStart(2, "0")}` +
            `${String(
                now.getMinutes()
            ).padStart(2, "0")}` +
            `${String(
                now.getSeconds()
            ).padStart(2, "0")}`;

        const fileName =
            `qc_audit_output_${timestamp}.json`;

        const filePath = path.join(
            outputDirectory,
            fileName
        );

        fs.writeFileSync(
            filePath,
            JSON.stringify(
                auditData,
                null,
                4
            ),
            "utf8"
        );

        return NextResponse.json({
            success: true,
            fileName,
            totalRecords:
                auditData.length,
            message:
                "Audit saved successfully",
        });

    } catch (error: any) {

        console.error(
            "Save Audit Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Failed to save audit file",
            },
            {
                status: 500,
            }
        );
    }
}