'use client';

import React from 'react';
import { Box, IconButton, ChakraProvider, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Toggle color mode"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      position="fixed"
      top={4}
      right={4}
      zIndex={1000}
    />
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChakraProvider>
      <Box>
        <ColorModeToggle />
        {children}
      </Box>
    </ChakraProvider>
  );
} 