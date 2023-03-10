import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  useWallet,
  Wallet as SolanaWallet,
} from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { createUser, findTalentPubkey } from '../../utils/functions';
import Avatar from 'boring-avatars';
import { truncatedPublicKey } from '../../utils/helpers';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { userStore } from '../../store/user';
import { SponsorType } from '../../interface/sponsor';
import { SponsorStore } from '../../store/sponsor';
import { useStore } from 'zustand';
import { TalentStore } from '../../store/talent';
import { ConnectWalletModal } from '../modals/connectWalletModal';
import toast from 'react-hot-toast';

interface Props {
  sponsors?: SponsorType[];
}
export const Navbar = ({ sponsors }: Props) => {
  const { setUserInfo } = userStore();
  const { setTalentInfo, talentInfo } = TalentStore();
  const router = useRouter();
  const { connected, publicKey, wallet, connect, select, wallets } =
    useWallet();
  useEffect(() => {
    const makeUser = async () => {
      console.log(publicKey, connected);

      if (publicKey && connected) {
        const res = await createUser(publicKey.toBase58() as string);
        setUserInfo(res.data);
        if (res.data.talent) {
          console.log('In');

          await findTalent();
        }
      }
    };
    makeUser();
  }, [publicKey, connected]);

  const findTalent = async () => {
    const talent = await findTalentPubkey(publicKey?.toBase58() as string);
    if (!talent) {
      return;
    }
    return setTalentInfo(talent.data);
  };

  const onDisconnectWallet = async () => {
    if (wallet == null) {
      return;
    }
    await wallet.adapter.disconnect();
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  // --
  const { setCurrentSponsor } = SponsorStore();
  const { userInfo } = userStore();

  const onConnectWallet = async (wallet: SolanaWallet) => {
    try {
      // await connect();

      select(wallet.adapter.name);
    } catch (e) {
      console.log(e, '--');

      toast.error('Wallet not found');
    }
  };

  console.log(talentInfo);

  return (
    <>
      {(isOpen || !connected) && (
        <ConnectWalletModal
          onConnectWallet={onConnectWallet}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      <Container
        maxW={'full'}
        p={{ xs: 10, md: 0 }}
        h={12}
        position={'absolute'}
        zIndex={10}
        top={0}
        bg={'#F1F5F9'}
        borderBottom={'1px solid rgba(255, 255, 255, 0.15)'}
        sx={{
          backdropFilter: 'blur(10px)',
          margin: '0px !important',
          marginTop: '0px !important',
        }}
      >
        <Flex
          px={6}
          align={'center'}
          justify={'space-between'}
          h={'full'}
          mx="auto"
        >
          <HStack w={'full'}>
            <Box cursor={'pointer'} onClick={() => router.push('/')}>
              <Image w={'12rem'} src={'/assets/logo/logo.png'} alt={'logo'} />
            </Box>
            {sponsors && (
              <Select
                w={'12rem'}
                onChange={(e) => {
                  setCurrentSponsor(sponsors![Number(e.currentTarget.value)]);
                }}
              >
                {sponsors?.map((sponsor, index) => {
                  return (
                    <option key={sponsor.id} value={index}>
                      {sponsor.name}
                    </option>
                  );
                })}
              </Select>
            )}
          </HStack>
          <Box>
            {!connected ? (
              <Button
                _hover={{ bg: '#6562FF' }}
                color={'white'}
                h={10}
                px={10}
                bg={'#6562FF'}
                onClick={() => {
                  if (router.asPath === '/') {
                    router.push('/new');
                    return;
                  }
                  onOpen();
                }}
              >
                Connect wallet
              </Button>
            ) : (
              <HStack gap={2}>
                {userInfo?.sponsor && (
                  <Button
                    w="100%"
                    fontSize="0.9rem"
                    fontWeight={600}
                    color="#6562FF"
                    border="1px solid #6562FF"
                    bg="transparent"
                    onClick={() => {
                      router.push('/listings/create');
                    }}
                  >
                    Create a Listing
                  </Button>
                )}
                <Divider
                  borderColor={'gray.300'}
                  h={12}
                  orientation={'vertical'}
                />

                <Menu>
                  <MenuButton>
                    <HStack>
                      <Avatar
                        variant="marble"
                        colors={['#92A1C6', '#F0AB3D', '#C271B4']}
                      />
                      <Flex gap={5} justify={'space-between'} align={'center'}>
                        <Text
                          color={'gray.600'}
                          fontWeight={600}
                          fontFamily={'Inter'}
                        >
                          {truncatedPublicKey(
                            publicKey?.toString() as string,
                            7
                          )}
                        </Text>
                        <MdOutlineKeyboardArrowDown />
                      </Flex>
                    </HStack>
                  </MenuButton>
                  <MenuList w={'15rem'}>
                    <MenuItem
                      isDisabled={!talentInfo?.username}
                      onClick={() => router.push(`/t/${talentInfo?.username}`)}
                    >
                      <Text fontSize="0.9rem" color="gray.600">
                        View Profile
                      </Text>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push('/dashboard/team');
                      }}
                    >
                      <Text fontSize="0.9rem" color="gray.600">
                        Dashboard
                      </Text>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        onDisconnectWallet();
                      }}
                    >
                      <Text fontSize="0.9rem" color="gray.600">
                        Disconnect
                      </Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            )}
          </Box>
        </Flex>
      </Container>
    </>
  );
};
