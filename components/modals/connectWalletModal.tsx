/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Image,
} from '@chakra-ui/react';
import {
  useWallet,
  Wallet as SolanaWallet,
} from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnectWallet: (wallet: SolanaWallet) => Promise<void>;
}
export const ConnectWalletModal = ({
  isOpen,
  onClose,
  onConnectWallet,
}: Props) => {
  const { wallets, connected } = useWallet();
  useEffect(() => {
    if (connected) {
      onClose();
    }
  }, [connected]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={'max'} w={'22rem'}>
          <Flex
            padding="2.5rem 2.2rem"
            flexFlow="column"
            align="center"
            justify="center"
            w="22rem"
            bg="white"
            boxShadow="0px 2px 4px rgba(56, 77, 110, 0.06)"
            borderRadius="1.6rem"
            gap="1rem"
          >
            <Box h="2rem" w="13rem" alignSelf="start">
              <img
                src="/assets/logo/logo.png"
                width="100%"
                height="100%"
                alt="Logo"
              />
            </Box>

            <Text
              fontSize="1rem"
              fontWeight={500}
              color="gray.400"
              paddingBottom="1rem"
              borderBottom="1px solid #E2E8EF"
            >
              Connect your wallet to continue to your dashboard
            </Text>
            <Flex
              flexFlow="column"
              align="start"
              justify="center"
              w="100%"
              gap="1rem"
            >
              {/* <WalletMultiButton /> */}
              {wallets.map((wallet: SolanaWallet, index: number) => {
                return (
                  <>
                    <Flex
                      key={index}
                      h="2.5rem"
                      align="center"
                      w="100%"
                      bg="gray.50"
                      borderRadius="1rem"
                      cursor="pointer"
                      _hover={{
                        bg: 'gray.100',
                      }}
                      padding="0 1.5rem"
                      onClick={onConnectWallet.bind(null, wallet)}
                    >
                      <Flex gap="1rem" align="center">
                        <Box
                          display={'flex'}
                          justifyContent={'center'}
                          alignItems={'center'}
                          w="2rem"
                          h="2rem"
                        >
                          <Image
                            width="70%"
                            height="70%"
                            src={wallet.adapter.icon ?? ''}
                            alt={`${wallet.adapter.name} Icon`}
                          />
                        </Box>
                        <Text
                          fontSize="1.1rem"
                          ml={2}
                          fontWeight={600}
                          color="gray.500"
                        >
                          {wallet.adapter.name ?? ''}
                        </Text>
                      </Flex>
                    </Flex>
                  </>
                );
              })}
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
