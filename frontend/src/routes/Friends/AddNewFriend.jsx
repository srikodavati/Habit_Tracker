import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from 'axios';

import { auth } from '../Auth/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Container,
  VStack,
  useToast,
  Heading,
  Button,
  Card,
  CardBody,
  Text,
  Input,
  List,
  ListItem,
  HStack,
} from '@chakra-ui/react';

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

export default function Friendfind() {
  const navigate = useNavigate();
  const toast = useToast();
  const [userNotFriendData, setUserNotFriendData] = useState([]);
  const [user, loading] = useAuthState(auth);
  if (!user) navigate('../', {});
  const [loaded, setLoaded] = useState(false);
  let [searchTerm, setSearchTerm] = useState('.');

  const getAllNotFriends = async () => {
    if (!loading) {
      await axios
        .get(`${BASE_URL}/api/users/${user.email}/notfriends`)
        .then(function (response) {
          setUserNotFriendData(response.data.not_friends_name_email);
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

  //Follow friend Functionality
  const FollowFriend = async (e) => {
    e.preventDefault();
    let button_index = Number(e.target.id); //index is stored in id field
    // console.log(button_index);

    //using index fetch that friend email id
    let friend_email_id = userNotFriendData[button_index][0];
    // console.log(friend_email_id);

    //call update api

    await axios
      .put(`${BASE_URL}/api/users/${user.email}/notfriends`, {
        friendEmail: friend_email_id,
      })
      .then(function (response) {
        setLoaded(false);
      })
      .catch(function (err) {
        console.log(err);
        toast({
          title: 'Error occured.',
          description: 'Could not Follow user.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
    toast({
      title: 'Success!',
      description: `Added ${userNotFriendData[button_index][1]} as new friend.`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  if (!loading) {
    if (!loaded) {
      getAllNotFriends();
      setLoaded(true);
    }
    return (
      <Layout user={user} currentRoute='friendfind'>
        <Container
          fontFamily='Montserrat'
          centerContent
          minH='80vh'
          justifyContent='center'
        >
          <VStack spacing={5} maxW='xl'>
            <Heading fontFamily='Montserrat' as='h1' size='lg'>
              Add New Friend
            </Heading>
            <Input
              variant='filled'
              htmlSize={50}
              width='auto'
              placeholder='Search for friend'
              id='message'
              onChange={getSearchedFriends}
            />
            <List minW='100%'>
              {userNotFriendData.length >= 1 &&
                userNotFriendData
                  .filter((elem) => elem[1].match(new RegExp(searchTerm, 'gi')))
                  // .filter((elem) => elem[0] !== user.email)
                  .map((item, index) => {
                    if (item[0] !== user.email) {
                      return (
                        <ListItem mb={3}>
                          <Card size='sm'>
                            <CardBody>
                              <HStack justifyContent='space-between'>
                                <Text>{item[1]}</Text>
                                <Button
                                  id={index}
                                  colorScheme='green'
                                  onClick={FollowFriend}
                                >
                                  Add
                                </Button>
                              </HStack>
                            </CardBody>
                          </Card>
                        </ListItem>
                      );
                    }
                  })}
            </List>
          </VStack>
        </Container>
      </Layout>
    );
  }
}
