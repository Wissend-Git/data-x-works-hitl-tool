"use client";

import {
  Tooltip as ChakraTooltip,
  Portal,
} from "@chakra-ui/react";

export const Tooltip = (props: any) => {
  const { content, children, ...rest } = props;

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>
        {children}
      </ChakraTooltip.Trigger>

      <Portal>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content>
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
};