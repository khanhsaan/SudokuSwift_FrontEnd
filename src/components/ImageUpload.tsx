import { useState, useCallback } from 'react';
import {
  Box,
  Stack,
  Text,
  Image,
  Button,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [solution, setSolution] = useState<{ original_grid: number[][]; solved_grid: number[][]; solution_image: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSolve = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setSolution(null);
    
    try {
      console.log('Sending image to the server...');
      const formData = new FormData();
      formData.append('file', image);

      const API_URL = import.meta.env.VITE_API_URL || 'http://3.26.96.93:8000';
      const response = await fetch(`${API_URL}/solve`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Full response data:', data);
      console.log('Response keys:', Object.keys(data));

      // Check multiple possible response structures
      if (data.success && data.solution_image) {
        console.log('Setting solution with success=true structure');
        setSolution({
          original_grid: data.original_grid || [],
          solved_grid: data.solved_grid || [],
          solution_image: data.solution_image,
        });
      } else if (data.solution_image) {
        // Handle case where there's no success field but solution_image exists
        console.log('Setting solution without success field');
        setSolution({
          original_grid: data.original_grid || [],
          solved_grid: data.solved_grid || [],
          solution_image: data.solution_image,
        });
      } else {
        console.error('No solution_image found in response:', data);
        const errorMessage = data.error || 'Unknown error occurred';
        console.error('Error from server:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error solving Sudoku:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBorderColor = useColorModeValue('blue.400', 'blue.300');
  const iconColor = useColorModeValue('blue.400', 'blue.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Stack 
      direction="column" 
      spacing={6} 
      width="100%" 
      align="center"
      justify="center"
      textAlign="center"
    >
      <AnimatePresence mode="wait">
        <MotionBox
          width="100%"
          height="400px"
          border="3px dashed"
          borderColor={isDragging ? hoverBorderColor : borderColor}
          borderRadius="2xl"
          bg={bgColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          overflow="hidden"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
          cursor="pointer"
          transition={{ duration: 0.3 }}
          _hover={{
            borderColor: hoverBorderColor,
            transform: 'translateY(-2px)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {image ? (
            <Box position="relative" width="100%" height="100%" p={4} display="flex" alignItems="center" justifyContent="center">
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded sudoku"
                maxW="100%"
                maxH="100%"
                objectFit="contain"
                borderRadius="lg"
              />
            </Box>
          ) : (
            <Stack
              direction="column"
              spacing={4}
              align="center"
              justify="center"
              p={8}
              textAlign="center"
              width="100%"
            >
              <MotionBox
                animate={pulseAnimation}
              >
                <Icon
                  viewBox="0 0 24 24"
                  boxSize={16}
                  color={iconColor}
                >
                  <path
                    fill="currentColor"
                    d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
                  />
                </Icon>
              </MotionBox>
              <Stack spacing={2} align="center">
                <Text fontSize="lg" fontWeight="medium" color={textColor}>
                  Drop your Sudoku puzzle here
                </Text>
                <Text fontSize="sm" color={textColor}>
                  or click to browse
                </Text>
              </Stack>
            </Stack>
          )}
        </MotionBox>
      </AnimatePresence>

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      <AnimatePresence>
        {image && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            width="100%"
          >
            <Button
              colorScheme="blue"
              size="lg"
              width="100%"
              onClick={handleSolve}
              fontSize="lg"
              py={7}
              boxShadow="lg"
              isLoading={isLoading}
              loadingText="Solving..."
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'xl',
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: 'md',
              }}
            >
              Solve Sudoku
            </Button>
          </MotionBox>
        )}
      </AnimatePresence>

      {error && (
        <Alert status="error" borderRadius="md" width="100%" textAlign="center">
          <AlertIcon />
          <Box width="100%">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              {error.includes('OpenCV') 
                ? 'The server is missing required dependencies. Please install OpenCV on the server.'
                : error
              }
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {solution && (
        <Box 
          mt={6} 
          width="100%"
          display="flex" 
          flexDirection="column" 
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>Here Is Solved Sudoku:</Text>
          <Image src={`data:image/png;base64,${solution.solution_image}`} alt="Solution" maxW="70%" />
          <Button mt={4} colorScheme="blue" onClick={() => {
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${solution.solution_image}`;
            link.download = 'solved_sudoku.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
            Download Image
          </Button>
        </Box>
      )}
    </Stack>
  );
}; 