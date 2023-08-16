import { useRef } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

import axios from 'axios';

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

export default function DeleteHabitButton({
  user,
  habits,
  habitsChangeHandler,
  index,
  parentModelOnClose,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Button colorScheme='red' onClick={onOpen}>
        Delete
      </Button>
      <AlertDialog
        motionPreset='slideInBottom'
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Habit
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={async () => {
                  const habitsCopy = [...habits];
                  habitsCopy.splice(index, 1);
                  habitsChangeHandler(habitsCopy);
                  await axios.delete(
                    `${BASE_URL}/api/users/${user.email}/habits/${habits[index].name}`,
                    {}
                  );
                  onClose();
                  parentModelOnClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
