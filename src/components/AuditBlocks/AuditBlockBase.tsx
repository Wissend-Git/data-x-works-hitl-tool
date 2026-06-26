// "use client";

// import { useEffect, useMemo, useState } from "react";

// import {
//     Box,
//     Container,
//     Flex,
//     Heading,
//     Spinner,
//     Text,
//     VStack,
// } from "@chakra-ui/react";

// import auditAssignData from "@/data/outputs/audit_files/audit_assign_manger_output.json";

// // Upcoming Components
// import AuditDashboard from "@/components/AuditBlocks/AuditDashboard";
// import AuditForm from "@/components/AuditBlocks/AuditForm";
// import AuditSummaryTable from "@/components/AuditBlocks/AuditSummaryTable";

// // Auth Context
// import { useAuth } from "@/context/AuthContext";

// export default function AuditBlockBase() {

//     const { user } = useAuth();

//     const [assignedAudits, setAssignedAudits] = useState<any[]>([]);
//     const [auditResults, setAuditResults] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         try {

//             if (!user) return;

//             const filteredData = auditAssignData.filter(
//                 (item: any) =>
//                     item.user === user.emp_id
//             );

//             setAssignedAudits(filteredData);

//         } catch (error) {
//             console.error("Audit load error:", error);
//         } finally {
//             setLoading(false);
//         }

//     }, [user]);

//     const dashboardStats = useMemo(() => {

//         let TP = 0;
//         let TN = 0;
//         let FP = 0;
//         let FN = 0;

//         auditResults.forEach((item: any) => {

//             switch (item.validation_type) {

//                 case "TP":
//                     TP++;
//                     break;

//                 case "TN":
//                     TN++;
//                     break;

//                 case "FP":
//                     FP++;
//                     break;

//                 case "FN":
//                     FN++;
//                     break;

//                 default:
//                     break;
//             }
//         });

//         return {
//             totalProducts: assignedAudits.length,
//             completed: auditResults.length,
//             pending:
//                 assignedAudits.length -
//                 auditResults.length,
//             TP,
//             TN,
//             FP,
//             FN
//         };

//     }, [auditResults, assignedAudits]);

//     if (loading) {

//         return (
//             <Flex
//                 h="70vh"
//                 justify="center"
//                 align="center"
//             >
//                 <Spinner size="xl" />
//             </Flex>
//         );
//     }

//     return (
//         <Container
//             maxW="8xl"
//             py={6}
//         >

//             <VStack gap={6} align="stretch">

//                 {/* Page Title */}

//                 <Box>

//                     <Heading
//                         size="2xl"
//                         textAlign="center"
//                     >
//                         Audit Management
//                     </Heading>

//                     <Text
//                         textAlign="center"
//                         color="gray.500"
//                         mt={2}
//                     >
//                         Human Validation vs AI Audit Results
//                     </Text>

//                 </Box>

//                 {/* Dashboard */}

//                 <AuditDashboard
//                     stats={dashboardStats}
//                 />

//                 {/* Audit Form */}

//                 <AuditForm
//                     assignedAudits={assignedAudits}
//                     auditResults={auditResults}
//                     setAuditResults={setAuditResults}
//                     user={user}
//                 />

//                 {/* Completed Audit Table */}

//                 <AuditSummaryTable
//                     auditResults={auditResults}
//                 />

//             </VStack>

//         </Container>
//     );
// }

"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Box,
    Container,
    Flex,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";

import AuditDashboard from "@/components/AuditBlocks/AuditDashboard";
import AuditForm from "@/components/AuditBlocks/AuditForm";
import AuditSummaryTable from "@/components/AuditBlocks/AuditSummaryTable";

import { useAuth } from "@/context/AuthContext";

export default function AuditBlockBase() {

    const { user } = useAuth();

    const [assignedAudits, setAssignedAudits] = useState<any[]>([]);
    const [auditResults, setAuditResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!user) return;

        try {

            const storedData =
                localStorage.getItem(
                    "assignedAudits"
                );

            if (!storedData) {

                setAssignedAudits([]);

                return;

            }

            const allAssignments =
                JSON.parse(storedData);

            const filtered =
                allAssignments.filter(
                    (item: any) =>
                        item.user === user.emp_id
                );

            setAssignedAudits(filtered);

        } catch (error) {

            console.error(
                "Audit load error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }, [user]);

    useEffect(() => {

        try {

            const savedAudits =
                localStorage.getItem(
                    "auditResults"
                );

            if (savedAudits) {

                setAuditResults(
                    JSON.parse(savedAudits)
                );

            }

        } catch (error) {

            console.error(error);

        }

    }, []);

    const dashboardStats = useMemo(() => {

        let TP = 0;
        let TN = 0;
        let FP = 0;
        let FN = 0;

        auditResults.forEach(
            (item: any) => {

                switch (
                    item.validation_type
                ) {

                    case "TP":
                        TP++;
                        break;

                    case "TN":
                        TN++;
                        break;

                    case "FP":
                        FP++;
                        break;

                    case "FN":
                        FN++;
                        break;
                }

            }
        );

        return {

            totalProducts:
                assignedAudits.length,

            completed:
                auditResults.length,

            pending:
                assignedAudits.length -
                auditResults.length,

            TP,
            TN,
            FP,
            FN,

        };

    }, [
        assignedAudits,
        auditResults,
    ]);

    if (loading) {

        return (

            <Flex
                h="70vh"
                justify="center"
                align="center"
            >

                <Spinner size="xl" />

            </Flex>

        );

    }

    return (

        <Container
            maxW="8xl"
            py={6}
        >

            <VStack
                gap={6}
                align="stretch"
            >

                <Box>

                    <Heading
                        size="2xl"
                        textAlign="center"
                    >
                        Audit Management
                    </Heading>

                    <Text
                        textAlign="center"
                        color="gray.500"
                        mt={2}
                    >
                        Human Validation vs AI Audit Results
                    </Text>

                </Box>

                <AuditDashboard
                    stats={
                        dashboardStats
                    }
                />

                <AuditForm
                    assignedAudits={
                        assignedAudits
                    }
                    auditResults={
                        auditResults
                    }
                    setAuditResults={
                        setAuditResults
                    }
                    user={user}
                />

                <AuditSummaryTable
                    auditResults={
                        auditResults
                    }
                />

            </VStack>

        </Container>

    );

}