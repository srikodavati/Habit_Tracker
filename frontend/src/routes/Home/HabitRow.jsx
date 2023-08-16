import moment from 'moment/moment';

import axios from 'axios';

import {
  Flex,
  HStack,
  Input,
  Stat,
  StatArrow,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import EditHabitButton from './EditHabitButton';

export const squareSideLen = 50;

const BASE_URL = 'https://habit-tracker-k1wh.onrender.com';

function isNumeric(str) {
  if (typeof str != 'string') return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

const NumericalHabitUnit = ({
  user,
  habits,
  habitsChangeHandler,
  index,
  dateString,
  dates,
  i,
}) => {
  const toast = useToast();
  const [currentVal, setCurrentVal] = useState(
    habits[index]['state'][dateString] ? habits[index]['state'][dateString] : ''
  );
  const [editMode, setEditMode] = useState(false);
  if (editMode) {
    return (
      <Input
        autoFocus
        style={{
          outlineStyle: 'none',
          boxShadow: 'none',
          borderColor: 'transparent',
        }}
        p={1}
        textAlign='center'
        value={currentVal}
        onChange={(event) => {
          setCurrentVal(event.target.value);
        }}
        onKeyUp={async (event) => {
          if (event.key === 'Enter' || event.keyCode === 13) {
            if (!isNumeric(event.target.value) && event.target.value) {
              return toast({
                title: 'Provided value is not a valid number!',
                status: 'error',
                isClosable: true,
              });
            }
            const habitsCopy = [...habits];
            const habitCopy = { ...habitsCopy[index] };
            habitCopy['state'][dateString] = currentVal;
            habitsCopy[index] = habitCopy;
            habitsChangeHandler(habitsCopy);
            await axios.put(
              `${BASE_URL}/api/users/${user.email}/habits/${habits[index].name}`,
              {
                name: habits[index].name,
                state: currentVal,
                stateDate: dateString,
              }
            );
            setEditMode(false);
          }
        }}
      />
    );
  }
  return (
    <VStack
      minW='100%'
      spacing={0}
      onClick={() => {
        setEditMode(true);
      }}
    >
      <Text fontFamily='Inconsolata' fontSize='md'>
        {habits[index].state[dateString]
          ? habits[index].state[dateString]
          : '-'}
      </Text>
      {habits[index].state[dateString] &&
        habits[index].state[dates[i - 1]] &&
        i > 0 &&
        parseFloat(habits[index].state[dates[i]]) !==
          parseFloat(habits[index].state[dates[i - 1]]) && (
          <Stat>
            <StatArrow
              type={
                parseFloat(habits[index].state[dates[i]]) >
                parseFloat(habits[index].state[dates[i - 1]])
                  ? 'increase'
                  : 'decrease'
              }
              m={0}
            />
          </Stat>
        )}
    </VStack>
  );
};

export default function HabitRow({
  user,
  habits,
  index,
  habitsChangeHandler,
  numDaysToGoBack,
}) {
  const rowItems = [];
  const dates = [];
  var latestDate = new Date();
  var earliestDate = new Date(
    latestDate.getTime() - numDaysToGoBack * 24 * 60 * 60 * 1000
  );
  for (let i = 0; i <= numDaysToGoBack; i++) {
    const date = new Date(earliestDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateString = moment(date).format('YYYY-MM-DD');
    dates.push(dateString);
    const state = habits[index].state[dateString];
    let squareColour = '';
    if (state === 1) {
      squareColour = `${habits[index].colour}.400`;
    } else if (
      state === 2 ||
      (habits[index].type === 'numerical' && habits[index].state[dateString])
    ) {
      squareColour = `${habits[index].colour}.100`;
    }

    rowItems.push(
      <Flex
        w={squareSideLen}
        h={squareSideLen}
        backgroundColor={squareColour}
        key={`${habits[index].name}-${dateString}`}
        borderRadius='15%'
        border='1px solid gray'
        _hover={{ cursor: 'pointer' }}
        align='center'
        justify='center'
        onClick={async () => {
          if (habits[index].type === 'binary') {
            const habitsCopy = [...habits];
            const currentState = habitsCopy[index].state[dateString];
            const newState = currentState ? (currentState + 1) % 2 : 1;
            const habitCopy = { ...habitsCopy[index] };
            habitCopy.state[dateString] = newState;
            habitsCopy[index] = habitCopy;
            habitsChangeHandler(habitsCopy);
            await axios.put(
              `${BASE_URL}/api/users/${user.email}/habits/${habits[index].name}`,
              {
                name: habits[index].name,
                state: newState,
                stateDate: dateString,
              }
            );
          } else {
          }
        }}
      >
        {habits[index].type === 'numerical' && (
          <NumericalHabitUnit
            user={user}
            habits={habits}
            habitsChangeHandler={habitsChangeHandler}
            index={index}
            dateString={dateString}
            dates={dates}
            i={i}
          />
        )}
      </Flex>
    );
  }

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

  if (numDaysToGoBack > 2) {
    rowItems.push(
      <Text
        textAlign='center'
        as='b'
        pl={10}
        fontFamily='Inconsolata'
        fontSize='lg'
        style={{ display: 'absolute' }}
      >
        {habits[index]['type'] === 'binary' ? calculateStreak(habits[index].state) : '-'}
      </Text>
    );
  }

  const [style, setStyle] = useState({ visibility: 'hidden' });

  return (
    <HStack mr={10}>
      <HStack
        minW='10rem'
        spacing={5}
        justify='right'
        mr={5}
        onMouseEnter={() => setStyle({ visibility: 'visible' })}
        onMouseLeave={() => setStyle({ visibility: 'hidden' })}
      >
        <EditHabitButton
          user={user}
          habits={habits}
          index={index}
          habitsChangeHandler={habitsChangeHandler}
          style={style}
          buttonVisibilityHandler={setStyle}
        />
        <Text fontFamily='Inconsolata' fontSize='xl' as='b' minW='5rem'>
          {habits[index].name}
        </Text>
      </HStack>
      {rowItems}
    </HStack>
  );
}
