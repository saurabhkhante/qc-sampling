'use client';

import React from 'react';
import { Box, IconButton, useColorMode, ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

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
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box>
        <ColorModeToggle />
        {children}
      </Box>
    </ChakraProvider>
  );
} 