import { Container } from '@chakra-ui/react';
import NavBar from './NavBar';

export default function Layout({ children, user, currentRoute }) {
  return (
    <>
      <NavBar currentRoute={currentRoute} user={user} />
      <Container justifyContent='center' h='calc(90vh)' maxWidth='6xl'>
        {children}
      </Container>
    </>
  );
}
