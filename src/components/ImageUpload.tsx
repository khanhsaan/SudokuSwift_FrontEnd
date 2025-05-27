import { useState, useCallback } from 'react';
import {
  Box,
  Stack,
  Text,
  Image,
  Button,
  Icon,
  useColorMode,
  useColorModeValue,
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
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { colorMode } = useColorMode();
  
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
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSolve = () => {
    // TODO: Implement solving logic
    console.log('Solving sudoku...');
  };

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBorderColor = useColorModeValue('blue.400', 'blue.300');
  const iconColor = useColorModeValue('blue.400', 'blue.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Stack direction="column" spacing={6} width="100%" align="center">
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
                src={image}
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
    </Stack>
  );
}; 