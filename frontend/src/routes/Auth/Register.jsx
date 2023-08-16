import Layout from '../../components/Layout';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, register } from './firebase';

import {
  Container,
  Heading,
  Link,
  Input,
  Button,
  Text,
  VStack,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import axios from 'axios';

import { useToast } from '@chakra-ui/react';

import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

const getFailureToastOption = (msg) => {
  return {
    title: 'Error occured.',
    description: msg.replace('Firebase: ', '').replace('auth/', '').replaceAll('-', ' '),
    status: 'error',
    duration: 9000,
    isClosable: true,
  };
};

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const toast = useToast();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate('../Home');
  }, [user, loading]);

  const getExistingUsers = () => {
    if (!loading) {
      axios
        .get(`${BASE_URL}/api/users`)
        .then(function (response) {
          setUsers(response.data.users.map((user) => user.userName));
        })
        .catch((error) => console.log(error));
    }
  };

  if (!loading) {
    if (!loaded) {
      getExistingUsers();
      setLoaded(true);
    }
  }

  return (
    <Layout currentRoute='register'>
      <Container
        fontFamily='Montserrat'
        centerContent
        minH='80vh'
        justifyContent='center'
      >
        <VStack p={12} borderRadius={8} boxShadow='lg' align='left' spacing={8}>
          <Heading fontFamily='Montserrat'>Register</Heading>
          <VStack>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<AiOutlineUser color='gray' />}
              />
              <Input
                type='text'
                variant='filled'
                className='register__textBox'
                value={username}
                minW='xs'
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<AiOutlineMail color='gray' />}
              />
              <Input
                type='text'
                variant='filled'
                className='register__textBox'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email Address'
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<RiLockPasswordLine color='gray' />}
              />
              <Input
                type='password'
                variant='filled'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />
            </InputGroup>
          </VStack>
          <Button
            colorScheme='teal'
            onClick={async () => {
              if (!username) {
                toast(getFailureToastOption('Username is required!'));
              } else if (!email) {
                toast(getFailureToastOption('Email is required!'));
              } else if (!password) {
                toast(getFailureToastOption('Password is required!'));
              } else if (users.includes(username)) {
                toast(
                  getFailureToastOption(
                    'User with same username already exists!'
                  )
                );
              } else {
                const [status, statusMessage] = await register(
                  username,
                  email,
                  password
                );
                if (!status) {
                  toast(getFailureToastOption(statusMessage));
                }
              }
            }}
          >
            {' '}
            Register
          </Button>
          <Text>
            Already have an account?{' '}
            <Link color='teal.500' href='../login'>
              Login
            </Link>
          </Text>
        </VStack>
      </Container>
    </Layout>
  );
}
