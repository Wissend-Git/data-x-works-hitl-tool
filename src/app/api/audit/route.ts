import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const filePath = path.join(
            process.cwd(),
            "src/data/output/sample_audit_grouped_output.json"
        );

        fs.writeFileSync(
            filePath,
            JSON.stringify(body, null, 2)
        );

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error,
            },
            { status: 500 }
        );
    }
}