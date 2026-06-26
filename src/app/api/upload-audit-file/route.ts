import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
// import XLSX from "xlsx";
import * as XLSX from "xlsx";

export async function POST(
    request: NextRequest
) {
    try {
        const formData =
            await request.formData();

        const file = formData.get(
            "file"
        ) as File;

        if (!file) {
            return NextResponse.json(
                {
                    message:
                        "No file uploaded",
                },
                {
                    status: 400,
                }
            );
        }

        const allowedExtensions = [
            "csv",
            "xlsx",
            "xls",
        ];

        const extension =
            file.name
                .split(".")
                .pop()
                ?.toLowerCase() || "";

        if (
            !allowedExtensions.includes(
                extension
            )
        ) {
            return NextResponse.json(
                {
                    message:
                        "Invalid file format",
                },
                {
                    status: 400,
                }
            );
        }

        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        if (!buffer.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Uploaded file is empty",
                },
                { status: 400 }
            );
        }

        const timestamp = new Date()
            .toISOString()
            .replace(/[-:]/g, "")
            .replace("T", "_")
            .split(".")[0];

        const originalName =
            path.parse(file.name).name;

        const newFileName = `${originalName}_${timestamp}.${extension}`;

        const uploadDir = path.join(
            process.cwd(),
            "src",
            "data",
            "client",
            "input"
        );

        if (
            !fs.existsSync(uploadDir)
        ) {
            fs.mkdirSync(
                uploadDir,
                {
                    recursive: true,
                }
            );
        }

        const filePath = path.join(
            uploadDir,
            newFileName
        );

        fs.writeFileSync(
            filePath,
            buffer
        );

        let jsonData: any[] = [];

        if (
            extension === "csv" ||
            extension === "xlsx" ||
            extension === "xls"
        ) {
            try {
                const workbook = XLSX.read(buffer, {
                    type: "buffer",
                });

                const sheetName = workbook.SheetNames[0];

                if (!sheetName) {
                    throw new Error("No worksheet found");
                }

                jsonData = XLSX.utils.sheet_to_json(
                    workbook.Sheets[sheetName],
                    {
                        defval: "",
                    }
                );
            } catch (error) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Unable to parse uploaded CSV/XLSX file",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }

        const jsonFileName =
            `${originalName}_${timestamp}.json`;

        const jsonPath =
            path.join(
                uploadDir,
                jsonFileName
            );

        if (jsonData.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "No records found in uploaded file",
                },
                { status: 400 }
            );
        }

        fs.writeFileSync(filePath, buffer);

        fs.writeFileSync(
            jsonPath,
            JSON.stringify(jsonData, null, 2)
        );

        return NextResponse.json({
            success: true,
            message:
                "File uploaded successfully",
            fileName:
                newFileName,
            jsonFile:
                jsonFileName,
            rows: jsonData.length,
        });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Upload failed",
            },
            {
                status: 500,
            }
        );
    }
}