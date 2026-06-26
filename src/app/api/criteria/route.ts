import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const body = await req.json();

    const filePath = path.join(
        process.cwd(),
        "src/data/outputs/criteria_output.json"
    );

    let existing = [];

    if (fs.existsSync(filePath)) {
        existing = JSON.parse(
            fs.readFileSync(
                filePath,
                "utf8"
            )
        );
    }

    existing.push(body);

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            existing,
            null,
            2
        )
    );

    return NextResponse.json({
        success: true
    });
}