import { useState } from 'react';

import axios from 'axios';

import { useDisclosure, useToast } from '@chakra-ui/react';
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  VStack,
} from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';

import ColourPicker from './ColourPicker';

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

export default function AddNewHabitButton({
  user,
  habits,
  habitsChangeHandler,
}) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [habitName, setHabitName] = useState('');
  const [habitType, setHabitType] = useState('binary');
  const [habitColour, setHabitColour] = useState('gray');

  return (
    <>
      <Button
        leftIcon={<AiOutlinePlus />}
        colorScheme='green'
        onClick={onOpen}
        fontFamily='Montserrat'
      >
        Add New Habit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily='Montserrat'>Add New Habit</ModalHeader>
          <ModalCloseButton mr={-1} />
          <ModalBody>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Habit Name</FormLabel>
                <Input
                  type='text'
                  placeholder='Examples: Exercise, Meditate, Read'
                  size='md'
                  value={habitName}
                  onChange={(event) => setHabitName(event.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel as='legend'>Type of Habit</FormLabel>
                <RadioGroup
                  defaultValue={habitType}
                  colorScheme='green'
                  name='habit-type'
                  value={habitType}
                  onChange={(value) => setHabitType(value)}
                >
                  <HStack spacing='24px'>
                    <Radio value='binary'>Binary</Radio>
                    <Radio value='numerical'>Numerical</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Habit Colour</FormLabel>
                <ColourPicker
                  colour={habitColour}
                  colourChangeHandler={setHabitColour}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              fontFamily='Montserrat'
              colorScheme='blue'
              mr={-2}
              onClick={async () => {
                if (habitName.length === 0) {
                  return toast({
                    title: 'Habit name cannot be empty!',
                    status: 'error',
                    isClosable: true,
                  });
                } else {
                  if (
                    habits.filter((habit) => {
                      return habitName === habit['name'];
                    }).length
                  ) {
                    return toast({
                      title: 'Habit already exists!',
                      status: 'error',
                      isClosable: true,
                    });
                  }
                  habitsChangeHandler([
                    ...habits,
                    {
                      name: habitName,
                      colour: habitColour,
                      type: habitType,
                      state: {},
                    },
                  ]);

                  await axios.post(
                    `${BASE_URL}/api/users/${user.email}/habits`,
                    { name: habitName, colour: habitColour, type: habitType }
                  );

                  setHabitName('');
                  setHabitType('binary');
                  setHabitColour('gray');
                  toast.closeAll();
                  onClose();
                }
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
