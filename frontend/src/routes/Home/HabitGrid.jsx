import moment from 'moment/moment';

import {
  Flex,
  Grid,
  HStack,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';

import HabitRow from './HabitRow';
import { squareSideLen } from './HabitRow';

export default function HabitGrid({ user, habits, habitsChangeHandler }) {
  const [isXlWidth] = useMediaQuery('(min-width: 1700px)');
  const [isLargeWidth] = useMediaQuery('(min-width: 1250px)');
  const [isMediumWidth] = useMediaQuery('(min-width: 900px)');
  const [isSmallWidth] = useMediaQuery('(min-width: 600px)');

  const getNumDaysToGoBack = () => {
    if (isXlWidth) return 20;
    else if (isLargeWidth) return 15;
    else if (isMediumWidth) return 10;
    else if (isSmallWidth) return 5;
    return 2;
  };

  const gridItems = [];
  for (let i = 0; i < habits.length; i++) {
    gridItems.push(
      <HabitRow
        user={user}
        key={i}
        index={i}
        habits={habits}
        habitsChangeHandler={habitsChangeHandler}
        numDaysToGoBack={getNumDaysToGoBack()}
      />
    );
  }

  const dateDays = [];
  var latestDate = new Date();
  var earliestDate = new Date(
    latestDate.getTime() - getNumDaysToGoBack() * 24 * 60 * 60 * 1000
  );
  for (let i = 0; i <= getNumDaysToGoBack(); i++) {
    const date = new Date(earliestDate.getTime() + i * 24 * 60 * 60 * 1000);
    dateDays.push(date);
  }

  const dateRow = dateDays.map((date) => {
    const isToday = moment(date).isSame(new Date(), 'day');
    return (
      <VStack
        spacing={0}
        w={squareSideLen}
        h={75}
        align='center'
        justify='center'
        key={date}
      >
        <Text
          fontFamily='Inconsolata'
          fontSize='xl'
          color={isToday ? 'green.500' : 'black'}
          as={isToday ? 'b' : ''}
        >
          {moment(date).format('DD')}
        </Text>
        <Text
          fontFamily='Inconsolata'
          fontSize='md'
          color={isToday ? 'green.500' : 'gray'}
          as={isToday ? 'b' : ''}
        >
          {moment(date).format('ddd')}
        </Text>
      </VStack>
    );
  });

  gridItems.splice(
    0,
    0,
    <HStack key={'this-is-just-to-supress-a-warning-lol'}>
      <Flex minW='10rem' ml={5}></Flex>
      {dateRow}
      {getNumDaysToGoBack() > 2 && <Text
        textAlign='center'
        as='b'
        pl={2}
        fontFamily='Inconsolata'
        fontSize='lg'
        style={{ display: 'absolute' }}
      >
        Streak 🔥
      </Text>}
    </HStack>
  );

  return <Grid gap={2}>{gridItems}</Grid>;
}
