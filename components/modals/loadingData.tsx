import {
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}
export const LoadingData = ({ isOpen, onClose }: Props) => {
  return (
    <>
      <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display={'flex'}
          justifyContent={'center'}
          p={5}
          alignItems={'center'}
          h={'30rem'}
          gap={5}
        >
          <Spinner thickness="4px" speed="0.65s" h={'8rem'} w={'8rem'} />
          <Text fontSize={'2rem'} fontWeight={600}>
            Loading...
          </Text>
        </ModalContent>
      </Modal>
    </>
  );
};
