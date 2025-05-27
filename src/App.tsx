import { ChakraProvider, Box, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import { ImageUpload } from './components/ImageUpload';

function App() {
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <ChakraProvider>
      <Box 
        minH="100vh" 
        bgGradient={bgGradient} 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        px={4}
        py={8}
      >
        <Box 
          maxW="container.lg" 
          w="100%" 
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Stack spacing={8} align="center" textAlign="center" width="100%">
            <Stack spacing={3} align="center">
              <Heading
                size="2xl"
                bgGradient="linear(to-r, blue.400, blue.600)"
                bgClip="text"
                letterSpacing="tight"
                textAlign="center"
              >
                SudokuSwift
              </Heading>
              <Text 
                fontSize="xl" 
                color={textColor} 
                maxW="600px" 
                mx="auto" 
                lineHeight="tall"
                textAlign="center"
              >
                Upload a photo of your Sudoku puzzle and let our AI solve it for you instantly.
              </Text>
            </Stack>
            <Box
              width="100%"
              maxW="600px"
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="xl"
              boxShadow="xl"
              p={6}
              mx="auto"
            >
              <ImageUpload />
            </Box>
          </Stack>
        </Box>
      </Box>
    </ChakraProvider>
  );
}


export default App;
