import { useState } from 'react';

import Layout from '../../components/Layout';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { auth } from '../Auth/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Container,
  Heading,
  useToast,
  Text,
  Select,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Badge,
} from '@chakra-ui/react';

var moment = require('moment'); // require

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

export default function Leaderboard() {
  const toast = useToast();
  const [user, loading] = useAuthState(auth);
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState([]);
  const [chosenHabit, setChosenHabit] = useState('');
  const [filterByFriend, setFilterByFriend] = useState(false);
  const navigate = useNavigate();

  if (!user) navigate('../', {});

  const getAllHabits = async () => {
    if (!loading) {
      await axios
        .get(`${BASE_URL}/api/users`)
        .then(function (response) {
          setUserData(response.data.users);
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

  const getDatesInRange = (startDate, endDate) => {
    var dates = [];
    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    while (currDate.add(1, 'days').diff(lastDate) < 1) {
      dates.push(currDate.clone().toDate());
    }
    return dates;
  };

  const calculateStreak = (stateDict) => {
    const dateArr = Object.keys(stateDict).map(
      (dateString) => new Date(dateString)
    );

    dateArr.sort(function (a, b) {
      return b - a;
    });
    const allDates = getDatesInRange(dateArr[dateArr.length - 1], new Date()); // State object in mongo doesn't have all dates. this array fixes that.
    allDates.reverse();

    let currentStreak = 0;

    for (let i = 0; i < allDates.length; i++) {
      let dateString = moment(allDates[i]).format('YYYY-MM-DD');
      if (!dateString in stateDict) {
        return currentStreak;
      } else if (stateDict[dateString] === 1) {
        currentStreak++;
      } else {
        return currentStreak;
      }
    }
    return currentStreak;
  };

  if (!loading) {
    if (!loaded) {
      getAllHabits();
      setLoaded(true);
    } else {
      const uniqueHabits = new Set();

      userData.map((user) =>
        user.habits
          .filter((habit) => habit.type === 'binary')
          .map((habit) => uniqueHabits.add(habit['name']))
      );

      const filteredData = userData.filter((data) =>
        data.habits.some((habit) => habit.name === chosenHabit)
      );

      let streaks = filteredData
        .map((data) => ({
          name: data.userName,
          email: data.email,
          streak: calculateStreak(
            data.habits.filter((habit) => habit.name === chosenHabit)[0].state
          ),
        }))
        .sort((a, b) =>
          a.streak < b.streak ? 1 : b.streak < a.streak ? -1 : 0
        );

      if (filterByFriend)
        streaks = streaks.filter((streak) =>
          userData
            .filter((u) => u.email === user.email)[0]
            .friends.includes(streak.email)
        );

      return (
        <Layout user={user} currentRoute='leaderboard'>
          <Container
            fontFamily='Montserrat'
            centerContent
            minH='80vh'
            justifyContent='center'
          >
            <VStack spacing={8}>
              <Heading fontFamily='Montserrat'>Leaderboard</Heading>
              <VStack>
                <Text textAlign='center'>
                  Here you will find the highest streak maintainers for each
                  habit.
                </Text>
                {!chosenHabit && (
                  <Text>
                    Select a habit from the dropdown below to get started!
                  </Text>
                )}
              </VStack>
              <HStack>
                <Select
                  variant='filled'
                  onChange={(event) => setChosenHabit(event.target.value)}
                  placeholder='Select'
                  value={chosenHabit}
                >
                  {Array.from(uniqueHabits).map((habit) => (
                    <option key={habit} value={habit}>
                      {habit}
                    </option>
                  ))}
                </Select>
              </HStack>
              {chosenHabit && (
                <Tabs
                  minW='xs'
                  onChange={(index) => {
                    if (index === 1) setFilterByFriend(true);
                    else setFilterByFriend(false);
                  }}
                  colorScheme='teal'
                  variant='soft-rounded'
                  align='center'
                >
                  <TabList>
                    <Tab>Global</Tab>
                    <Tab>Friends</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <TableContainer>
                        <Table variant='striped'>
                          <Thead>
                            <Tr>
                              <Th>Username</Th>
                              <Th>Streak</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {streaks.map((u) => (
                              <Tr key={u.name}>
                                <Td>
                                  <HStack>
                                    <Text>{u.name}</Text>
                                    {user.email === u.email && (
                                      <Badge
                                        fontSize='0.7rem'
                                        ml='1'
                                        colorScheme='green'
                                      >
                                        You
                                      </Badge>
                                    )}
                                  </HStack>
                                </Td>
                                <Td>{u.streak}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                    <TabPanel>
                      {streaks.length ? (
                        <TableContainer>
                          <Table variant='striped'>
                            <Thead>
                              <Tr>
                                <Th>Username</Th>
                                <Th>Streak</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {streaks.map((user) => (
                                <Tr key={user.name}>
                                  <Td>{user.name}</Td>
                                  <Td>{user.streak}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Text maxW='xs'>
                          You have no friends who are tracking this habit.
                        </Text>
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}
            </VStack>
          </Container>
        </Layout>
      );
    }
  }
}
