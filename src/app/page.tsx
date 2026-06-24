import { Box, Flex, Text } from "@chakra-ui/react";
import LoginPage from "../components/Login/page"

export default function Page() {
  return (
    <Flex h={"calc(90vh - 15px)"} p="2">
      <LoginPage />
    </Flex>
  );
}