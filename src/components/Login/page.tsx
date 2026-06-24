"use client";

import {
  Button,
  Input,
  VStack,
  Heading,
  Flex,
} from "@chakra-ui/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import credentials from "@/data/credentials.json";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {

  const router = useRouter();
  const { login } = useAuth();

  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = credentials.find(
      (item) =>
        item.emp_id.toUpperCase() ===
        empId.toUpperCase() &&
        item.password === password
    );

    if (!user) {
      alert("Invalid Credentials");
      return;
    }

    login(user);

    if (user.role === "client") {
      router.push("/criteria");
    }else if (user.role === "manager") {
      router.push("/lead_audit");
    } else {
      router.push("/audit");
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Flex
      w="400px"
      mx="auto"
      mt="100px"
      p={5}
      bg="#fefefe"
      alignItems="center"
      justifyContent={"center"}
      borderRadius={"10px"}
      shadow="md"
      flexDir="column"
      gap={10}
    >

      <Heading color={"#333333"}>Data-X</Heading>
      <form onSubmit={handleSubmit}>
        <VStack gap={4}>
          <Input
            placeholder="Employee ID"
            value={empId}
            onChange={(e) =>
              setEmpId(e.target.value)
            }
            border={"1px solid #ccc"}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            border={"1px solid #ccc"}
          />

          <Button
            w="100%"
            type="submit"
            bg="#1D2A44"
          >
            Login
          </Button>
        </VStack>
      </form>
    </Flex>
  );
}