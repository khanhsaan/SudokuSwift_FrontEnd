import { ChakraProvider, Container, Heading, Text, Stack, Box, useColorModeValue } from '@chakra-ui/react';
import { ImageUpload } from './components/ImageUpload';

function App() {
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <ChakraProvider>
      <Box minH="100vh" bgGradient={bgGradient} py={12} display="flex" alignItems="center">
        <Container maxW="container.lg" centerContent>
          <Stack direction="column" spacing={8} align="center" width="100%">
            <Stack textAlign="center" spacing={3} width="100%" alignItems="center">
              <Heading
                size="2xl"
                bgGradient="linear(to-r, blue.400, blue.600)"
                bgClip="text"
                letterSpacing="tight"
              >
                Sudoku Solver
              </Heading>
              <Text
                fontSize="xl"
                color={textColor}
                maxW="600px"
                lineHeight="tall"
              >
                Upload a photo of your Sudoku puzzle and let our AI solve it for you instantly
              </Text>
            </Stack>
            <Box
              w="100%"
              maxW="600px"
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="xl"
              boxShadow="xl"
              p={6}
            >
              <ImageUpload />
            </Box>
          </Stack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
