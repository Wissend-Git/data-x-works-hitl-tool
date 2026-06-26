// import { NextRequest, NextResponse } from "next/server";

// import fs from "fs";
// import path from "path";

// import auditData from "@/data/client/input/client_sample_audit_input.json";

// export async function POST(
//     req: NextRequest
// ) {

//     const body =
//         await req.json();

//     const {
//         users,
//         sampling,
//         checklist
//     } = body;

//     const shuffled =
//         [...auditData].sort(
//             () =>
//                 Math.random() - 0.5
//         );

//     const count =
//         Math.ceil(
//             (sampling / 100) *
//             shuffled.length
//         );

//     const sample =
//         shuffled.slice(
//             0,
//             count
//         );

//     const output =
//         sample.map(
//             (
//                 item,
//                 index
//             ) => ({
//                 project_name:
//                     checklist.project_name,

//                 audit_core:
//                     checklist.audit_core,

//                 category_name:
//                     checklist.category_name,

//                 url:
//                     item.url,

//                 ai_result:
//                     item.ai_result,

//                 user:
//                     users[
//                     index %
//                     users.length
//                     ]
//             })
//         );

//     const timestamp =
//         new Date()
//             .toISOString()
//             .replace(
//                 /[:.]/g,
//                 "-"
//             );

//     const dir =
//         path.join(
//             process.cwd(),
//             "src/data/outputs/audit_files"
//         );

//     if (
//         !fs.existsSync(dir)
//     ) {
//         fs.mkdirSync(dir, {
//             recursive: true
//         });
//     }

//     fs.writeFileSync(
//         path.join(
//             dir,
//             `audit_assign_${timestamp}.json`
//         ),
//         JSON.stringify(
//             output,
//             null,
//             2
//         )
//     );

//     return NextResponse.json({
//         success: true,
//         count:
//             output.length
//     });
// }

import { NextRequest, NextResponse } from "next/server";

import auditData from "@/data/client/input/client_sample_audit_input.json";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            users,
            sampling,
            checklist,
        } = body;

        if (
            !users ||
            users.length === 0 ||
            !sampling ||
            !checklist
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request payload",
                },
                { status: 400 }
            );
        }

        // Shuffle audit records
        const shuffled = [...auditData].sort(
            () => Math.random() - 0.5
        );

        // Calculate sample count
        const count = Math.ceil(
            (sampling / 100) * shuffled.length
        );

        // Pick sample records
        const sample = shuffled.slice(0, count);

        // Assign users
        const output = sample.map(
            (item: any, index: number) => ({
                project_name:
                    checklist.project_name,

                audit_core:
                    checklist.audit_core,

                category_name:
                    checklist.category_name,

                url: item.url,

                ai_result:
                    item.ai_result,

                user:
                    users[
                        index %
                        users.length
                    ],
            })
        );

        return NextResponse.json({
            success: true,
            count: output.length,
            data: output,
        });

    } catch (error) {

        console.error(
            "Assign Audit Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to assign audit",
            },
            { status: 500 }
        );
    }
}