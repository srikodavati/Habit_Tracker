import Layout from '../../components/Layout';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, logIn } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Container,
  VStack,
  Heading,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';

import { AiOutlineMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';

const getFailureToastOption = (msg) => {
  return {
    title: 'Error occured.',
    description: msg,
    status: 'error',
    duration: 9000,
    isClosable: true,
  };
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate('../Home');
  }, [user, loading]);

  return (
    <Layout currentRoute='login'>
      <Container
        fontFamily='Montserrat'
        centerContent
        minH='80vh'
        justifyContent='center'
      >
        <VStack p={12} borderRadius={8} boxShadow='lg' align='left' spacing={8}>
          <Heading fontFamily='Montserrat'>Log In</Heading>
          <VStack>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<AiOutlineMail color='gray' />}
              />
              <Input
                type='email'
                variant='filled'
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
              if (!email) {
                toast(getFailureToastOption('Email is required!'));
              } else if (!password) {
                toast(getFailureToastOption('Password is required!'));
              } else {
                const [status, statusMessage] = await logIn(email, password);
                if (!status) {
                  toast(getFailureToastOption(statusMessage));
                }
              }
            }}
          >
            {' '}
            Log In
          </Button>
        </VStack>
      </Container>
    </Layout>
  );
}
