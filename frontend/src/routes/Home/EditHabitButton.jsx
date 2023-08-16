import { useState } from 'react';

import axios from 'axios';

import { useDisclosure, useToast } from '@chakra-ui/react';

import {
  Button,
  FormControl,
  FormHelperText,
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

import { GrFormEdit } from 'react-icons/gr';

import { IconButton } from '@chakra-ui/react';
import ColourPicker from './ColourPicker';
import DeleteHabitButton from './DeleteHabitButton';

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

export default function EditHabitButton({
  user,
  habits,
  index,
  habitsChangeHandler,
  style,
  buttonVisibilityHandler,
}) {
  const [habitName, setHabitName] = useState(habits[index].name);
  const [habitColour, setHabitColour] = useState(habits[index].colour);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <>
      <IconButton
        icon={<GrFormEdit />}
        size='md'
        fontSize='1.5rem'
        style={style}
        _hover={{ cursor: 'pointer' }}
        onClick={onOpen}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Habit</ModalHeader>
          <ModalCloseButton
            mr={-1}
            onClick={() => {
              buttonVisibilityHandler({ visibility: 'hidden' });
              setIsButtonDisabled(true);
              onClose();
            }}
          />
          <ModalBody>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Habit Name</FormLabel>
                <Input
                  type='text'
                  value={habitName}
                  onChange={(event) => {
                    setHabitName(event.target.value);
                    setIsButtonDisabled(false);
                  }}
                  size='md'
                />
              </FormControl>
              <FormControl>
                <FormLabel as='legend'>Type of Habit</FormLabel>
                <RadioGroup
                  defaultValue='binary'
                  colorScheme='green'
                  name='habit-type'
                >
                  <HStack spacing='24px'>
                    <Radio isDisabled value='binary'>
                      Binary
                    </Radio>
                    <Radio isDisabled value='numerical'>
                      Numerical
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormHelperText>Habit type cannot be changed.</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Habit Colour</FormLabel>
                <ColourPicker
                  colour={habitColour}
                  colourChangeHandler={setHabitColour}
                  buttonDisabledStateHandler={setIsButtonDisabled}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack mr={-2}>
              <DeleteHabitButton
                user={user}
                habits={habits}
                habitsChangeHandler={habitsChangeHandler}
                index={index}
                parentModelOnClose={onClose}
              />
              <Button
                disabled={isButtonDisabled}
                colorScheme='blue'
                onClick={async () => {
                  if (habitName.length === 0) {
                    return toast({
                      title: 'Habit name cannot be empty!',
                      status: 'error',
                      isClosable: true,
                    });
                  } else {
                    const habitsCopy = [...habits];
                    const habitCopy = { ...habitsCopy[index] };
                    habitCopy.colour = habitColour;
                    habitCopy.name = habitName;
                    habitsCopy[index] = habitCopy;
                    habitsChangeHandler(habitsCopy);
                    await axios.put(
                      `${BASE_URL}/api/users/${user.email}/habits/${habits[index].name}`,
                      { name: habitName, colour: habitColour }
                    );
                    buttonVisibilityHandler({ visibility: 'hidden' });
                    setIsButtonDisabled(true);
                    onClose();
                  }
                }}
              >
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
