import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Heading, useToast, VStack } from '@chakra-ui/react';

import { auth } from '../Auth/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';

import HabitGrid from './HabitGrid';
import Layout from '../../components/Layout';
import AddNewHabitButton from './AddNewHabitButton';

var moment = require('moment'); // require

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const [habits, setHabits] = useState([]);
  const [user, loading] = useAuthState(auth);
  if (!user) navigate('../', {});
  const [loaded, setLoaded] = useState(false);

  const getAllHabits = () => {
    if (!loading) {
      axios
        .get(`${BASE_URL}/api/users/${user.email}/habits`)
        .then(function (response) {
          setHabits(response.data.habits);
        })
        .catch(function () {
          toast({
            title: 'Error occured.',
            description: 'Could not get habits of user.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  if (!loading) {
    if (!loaded) {
      getAllHabits();
      setLoaded(true);
    }
    return (
      <Layout user={user} currentRoute='home'>
        <VStack
          justifyContent='center'
          height='100%'
          spacing={50}
        >
          <VStack>
            <Heading fontFamily='Montserrat' size='lg'>
              Welcome! It is {moment().format('MMM Do, YYYY')}
            </Heading>
            <Heading fontFamily='Montserrat' size='md' color='gray'>
              Track your habits for today.
            </Heading>
          </VStack>
          {habits && habits.length && (
            <HabitGrid
              user={user}
              habits={habits}
              habitsChangeHandler={setHabits}
            />
          )}
          {habits && !habits.length && (
            <Heading fontFamily='Montserrat' fontSize='xl' textAlign='center'>
              You currently have no tracked habits. Click on the button below to
              get started.
            </Heading>
          )}
          <AddNewHabitButton
            user={user}
            habits={habits ? habits : []}
            habitsChangeHandler={setHabits}
          />
        </VStack>
      </Layout>
    );
  }
}
