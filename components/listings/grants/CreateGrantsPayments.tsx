import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { tokenList, PrizeList, MultiSelectOptions } from '../../../constants';
import {
  GrantsBasicType,
  GrantsType,
  PrizeListType,
} from '../../../interface/listings';
import { PrizeLabels } from '../../../interface/types';
import { SponsorStore } from '../../../store/sponsor';
import { createGrants } from '../../../utils/functions';
import { genrateuuid } from '../../../utils/helpers';

interface PrizeList {
  label: string;
  placeHolder: number;
}
interface Props {
  setSteps: Dispatch<SetStateAction<number>>;
  editorData: string | undefined;
  mainSkills: MultiSelectOptions[];
  subSkills: MultiSelectOptions[];
  grantsBasic: GrantsBasicType | undefined;
  onOpen: () => void;
  createDraft: (payment: string) => void;
  setSlug: Dispatch<SetStateAction<string>>;
}
export const CreateGrantsPayment = ({
  setSteps,
  editorData,
  mainSkills,
  subSkills,
  grantsBasic,
  onOpen,
  setSlug,
}: Props) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm();
  // handles which token is selected
  const [tokenIndex, setTokenIndex] = useState<number | undefined>(undefined);
  // stores the state for prize
  const { currentSponsor } = SponsorStore();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <VStack pb={10} color={'gray.500'} pt={7} align={'start'} w={'2xl'}>
        <form
          onSubmit={handleSubmit(async (e) => {
            if (Number(e.max_sal) < Number(e.min_sal)) {
              toast.error('Minimum Grants Cannot Be More Than Maximum Grants');

              return;
            }

            setLoading(true);
            console.log(e);
            const info: GrantsType = {
              id: genrateuuid(),
              active: true,
              token: tokenList[tokenIndex as number].mintAddress,
              orgId: currentSponsor?.orgId ?? '',
              maxSalary: Number(e.max_sal),
              minSalary: Number(e.min_sal),
              contact: grantsBasic?.contact ?? '',
              description: JSON.stringify(editorData),
              skills: JSON.stringify(mainSkills),
              subSkills: JSON.stringify(subSkills),
              source: 'native',
              title: grantsBasic?.title ?? '',
            };
            const res = await createGrants(info);
            if (res && res.data.code === 201) {
              onOpen();
              setSlug(
                ('/grants/' + grantsBasic?.title.split(' ').join('-')) as string
              );
              setLoading(false);
            } else {
              setLoading(false);
            }
          })}
          style={{ width: '100%' }}
        >
          <FormControl isRequired>
            <FormLabel color={'gray.500'}>Select Token</FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                w="100%"
                h="100%"
                fontSize="1rem"
                height={'2.6rem'}
                fontWeight={500}
                color="gray.400"
                bg="transparent"
                textAlign="start"
                overflow="hidden"
                border={'1px solid #cbd5e1'}
              >
                {tokenIndex === undefined ? (
                  'Select'
                ) : (
                  <HStack>
                    <Image
                      w={'1.6rem'}
                      rounded={'full'}
                      src={tokenList[tokenIndex as number]?.icon}
                      alt={tokenList[tokenIndex as number]?.tokenName}
                    />
                    <Text>{tokenList[tokenIndex as number]?.tokenName}</Text>
                  </HStack>
                )}
              </MenuButton>
              <MenuList
                w="40rem"
                fontSize="1rem"
                fontWeight={500}
                color="gray.400"
                maxHeight="15rem"
                overflow="scroll"
              >
                {tokenList.map((token, index) => {
                  return (
                    <>
                      <MenuItem
                        key={token.mintAddress}
                        onClick={() => {
                          setTokenIndex(index);
                        }}
                      >
                        <HStack>
                          <Image
                            w={'1.6rem'}
                            rounded={'full'}
                            src={token.icon}
                            alt={token.tokenName}
                          />
                          <Text>{token.tokenName}</Text>
                        </HStack>
                      </MenuItem>
                    </>
                  );
                })}
              </MenuList>
            </Menu>
          </FormControl>
          <HStack my={6}>
            <FormControl w="full" isRequired>
              <Flex>
                <FormLabel
                  color={'gray.500'}
                  fontWeight={600}
                  fontSize={'15px'}
                  htmlFor={'min_sal'}
                >
                  Minimum Grants (USD)
                </FormLabel>
              </Flex>

              <Input
                id="min_sal"
                type={'number'}
                placeholder="100,000"
                {...register('min_sal')}
              />
              <FormErrorMessage>
                {errors.min_sal ? <>{errors.min_sal.message}</> : <></>}
              </FormErrorMessage>
            </FormControl>
            <FormControl w="full" isRequired>
              <Flex>
                <FormLabel
                  color={'gray.500'}
                  fontWeight={600}
                  fontSize={'15px'}
                  htmlFor={'max_sal'}
                >
                  Maximum Grants (USD)
                </FormLabel>
              </Flex>

              <Input
                id="max_sal"
                placeholder="150,000"
                type={'number'}
                {...register('max_sal')}
              />
              <FormErrorMessage>
                {errors.max_sal ? <>{errors.max_sal.message}</> : <></>}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <VStack gap={6} mt={10}>
            <Button
              w="100%"
              bg={'#6562FF'}
              color={'white'}
              _hover={{ bg: '#6562FF' }}
              fontSize="1rem"
              fontWeight={600}
              type={'submit'}
              isLoading={loading}
              disabled={loading}
            >
              Finish the Listing
            </Button>
            <Button
              w="100%"
              fontSize="1rem"
              fontWeight={600}
              color="gray.500"
              border="1px solid"
              borderColor="gray.200"
              bg="transparent"
            >
              Save as Drafts
            </Button>
          </VStack>
        </form>
      </VStack>
    </>
  );
};
