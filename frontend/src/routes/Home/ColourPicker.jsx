import {
    Center,
    Button,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    SimpleGrid,
  } from '@chakra-ui/react';
  
  export default function ColourPicker({
    colour,
    colourChangeHandler,
    buttonDisabledStateHandler,
  }) {
    const colours = [
      'red',
      'orange',
      'yellow',
      'green',
      'teal',
      'blue',
      'pink',
      'purple',
      'gray',
    ];
    return (
      <>
        <Popover variant='outline'>
          <PopoverTrigger>
            <Button
              background={`${colour}.500`}
              _hover={{ background: `${colour}.500` }}
              height='1.5rem'
              width='1.5rem'
              padding={0}
              minWidth='unset'
              borderRadius={3}
            ></Button>
          </PopoverTrigger>
          <PopoverContent width='10rem'>
            <PopoverCloseButton color='white' mr={-1} />
            <PopoverHeader
              height='100px'
              backgroundColor={`${colour}.500`}
              borderTopLeftRadius={5}
              borderTopRightRadius={5}
              color='white'
            >
              <Center height='100%'>{`${
                colour.charAt(0).toUpperCase() + colour.slice(1)
              }`}</Center>
            </PopoverHeader>
            <PopoverBody height='6rem'>
              <SimpleGrid columns={5} spacing={1}>
                {colours.map((colour) => (
                  <Button
                    key={colour}
                    background={`${colour}.500`}
                    height='1.5rem'
                    width='1.5rem'
                    padding={0}
                    minWidth='unset'
                    borderRadius={3}
                    _hover={{ background: `${colour}.500` }}
                    onClick={() => {
                      colourChangeHandler(colour);
                      buttonDisabledStateHandler &&
                        buttonDisabledStateHandler(false);
                    }}
                  ></Button>
                ))}
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </>
    );
  }