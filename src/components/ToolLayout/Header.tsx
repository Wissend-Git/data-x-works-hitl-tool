"use client";

import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Power } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from 'react';

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const LogoutHandle = () => {
        logout();
        router.push("/");
    };

    return (
        <Stack
            h="10vh"
            bg="#fff"
            pos="sticky" top="0"
            borderRadius={10}
            w="full" p="1"
            zIndex={100}
            justifyContent="space-between"
            direction="row"
            alignContent="center" alignItems="center"
            boxShadow={"1px 1px 8px 0px #ccc"}
        >
            <Heading fontSize={25} color="#1D2A44" textAlign="center" as="h2" px="3">
                HITL - Quality Audit
            </Heading>
            <Stack p="1" w="35%" direction="row" alignItems="center" justifyContent="flex-end">
                <Flex gap={2} p="5px 10px" justifyContent={"center"}>
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Box w="35px" h="35px" borderRadius={"50%"} bg={"#1D2A44"}></Box>
                    </Flex>
                    <Flex flexDir={"column"}>
                        <Text fontSize={16} color="#1D2A44" fontWeight={600}>{user?.name || "Guest"}</Text>
                        <Text fontSize={13} color="#1D2A44">{user?.emp_id || "G00000"}</Text>
                    </Flex>
                </Flex>
                <Box
                    p="3"
                    borderRadius={50}
                    cursor={"pointer"}
                    color="#1D2A44"
                    _hover={{ color: "red" }}
                    fontSize={20}
                    fontWeight={600}
                    className="hover:animate-pulse"
                    onClick={LogoutHandle}
                >
                    <Power />
                </Box>
            </Stack>
        </Stack>
    );
}

// import { Select, createListCollection } from "@chakra-ui/react"
// import { Text, VStack } from "@chakra-ui/react"

// // 1. Define your dataset with both labels and descriptions
// const features = createListCollection({
//   items: [
//     { value: "dashboard", label: "Dashboard", desc: "Overview of your metrics and KPIs." },
//     { value: "analytics", label: "Analytics", desc: "Deep dive into real-time traffic." },
//     { value: "settings", label: "Settings", desc: "Manage account and integrations." },
//   ],
// })

// export const CustomDescriptiveSelect = () => {
//   return (
//     <Select.Root collection={features} maxW="320px">
//       <Select.Trigger>
//         <Select.ValueText placeholder="Select a feature" />
//       </Select.Trigger>
      
//       <Select.Content>
//         {features.items.map((item) => (
//           <Select.Item item={item} key={item.value} p="3">
//             {/* 2. Arrange layout vertically inside the option */}
//             <VStack align="start" gap="0.5">
//               <Text fontWeight="medium" fontSize="sm">
//                 {item.label}
//               </Text>
//               <Text fontSize="xs" color="fg.muted">
//                 {item.desc}
//               </Text>
//             </VStack>
//           </Select.Item>
//         ))}
//       </Select.Content>
//     </Select.Root>
//   )
// }