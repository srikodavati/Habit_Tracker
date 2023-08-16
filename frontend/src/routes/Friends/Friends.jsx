import { useState } from 'react';

import Layout from '../../components/Layout';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { auth } from '../Auth/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import { AiOutlinePlus } from 'react-icons/ai';

import {
  HStack,
  VStack,
  useToast,
  Link,
  Center,
  Heading,
  ListItem,
  FormControl,
  Container,
  Button,
  Stack,
  Box,
  Card,
  CardBody,
  SimpleGrid,
  Text,
  Input,
  List,
} from '@chakra-ui/react';

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

export default function Friends({ currentRoute }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [userFriendData, setUserFriendData] = useState([]);
  const [user, loading] = useAuthState(auth);
  if (!user) navigate('../', {});
  const [loaded, setLoaded] = useState(false);
  let [searchTerm, setSearchTerm] = useState('.');

  const getAllFriends = async () => {
    if (!loading) {
      await axios
        .get(`${BASE_URL}/api/users/${user.email}/friends`)
        .then(function (response) {
          setUserFriendData(response.data.friends_name_email);
          // console.log(response.data.friends_name_email);
          // console.log(userFriendData);
        })
        .catch(function (err) {
          console.log(err);
          toast({
            title: 'Error occured.',
            description: 'Could not get details of users.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  //Search Functionality
  const getSearchedFriends = (event) => {
    setSearchTerm(event.target.value);
    // console.log(event.target.value);
  };

  //Unfollow friend Functionality
  const UnfollowFriend = async (e) => {
    e.preventDefault();
    let button_index = Number(e.target.id); //index is stored in id field
    // console.log(button_index);

    //using index fetch that friend email id
    let friend_email_id = userFriendData[button_index][0];
    // console.log(friend_email_id);

    //call update api

    await axios
      .put(`${BASE_URL}/api/users/${user.email}/friends`, {
        friendEmail: friend_email_id,
      })
      .then(function (response) {
        setLoaded(false);
      })
      .catch(function (err) {
        console.log(err);
        toast({
          title: 'Error occured!',
          description: 'Could not unfollow user.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });

    toast({
      title: 'Success!',
      description: `Unfollowed ${userFriendData[button_index][1]}.`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  if (!loading) {
    if (!loaded) {
      getAllFriends();
      setLoaded(true);
    }
    return (
      <Layout user={user} currentRoute='friends'>
        <Container centerContent minH='80vh' justifyContent='center'>
          <VStack fontFamily='Montserrat' spacing={8} maxW='xl'>
            <Heading fontFamily='Montserrat'>Friends</Heading>
            <Text textAlign='center'>
              Here you will your find the highest streak maintainers among
              all your friends.
            </Text>
            <HStack minW='80%'>
              <Input
                variant='filled'
                borderRadius={50}
                placeholder='Search for existing friend'
                id='message'
                onChange={getSearchedFriends}
              />
              {['Add New Friend'].map((routeName) => (
                <Link
                  href={'/addnewfriend'}
                  key={'Find friends'}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    borderRadius={50}
                    colorScheme='gray'
                    leftIcon={<AiOutlinePlus />}
                    variant={
                      currentRoute === routeName.toLowerCase()
                        ? 'solid'
                        : 'outline'
                    }
                  >
                    {routeName}
                  </Button>
                </Link>
              ))}
            </HStack>
            <List minW='80%'>
              {userFriendData.length >= 1 &&
                userFriendData
                  .filter((elem) => elem[1].match(new RegExp(searchTerm, 'gi')))
                  .filter((elem) => elem[0] !== user.email)
                  .map((item, index) => {
                    return (
                      <ListItem mb={3}>
                        <Card size='sm'>
                          <CardBody>
                            <HStack justify='space-between'>
                              <VStack align='left' spacing={0}>
                                <Text> {item[1]}</Text>
                              </VStack>
                              <Button
                                id={index}
                                colorScheme='red'
                                onClick={UnfollowFriend}
                              >
                                {' '}
                                Unfriend{' '}
                              </Button>
                            </HStack>
                          </CardBody>
                        </Card>
                      </ListItem>
                    );
                  })}
            </List>
          </VStack>
        </Container>
      </Layout>
    );
  }
}
