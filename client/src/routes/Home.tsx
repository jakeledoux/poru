import {
  Center,
  Heading,
  Link,
  Image,
  Box,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import logo from "../../img/poru.png";

function Home() {
  return (
    <>
      <Center>
        <HStack>
          <Box>
            <Heading color="#3a180d">welcome to poru.</Heading>
            <Text>a simple website for creating and voting in polls.</Text>
            <Link color="teal" as={RouterLink} to="/create">
              create a poll?
            </Link>
          </Box>
          <Spacer />

          <Image boxSize="400px" src={logo} alt="poru logo" />
        </HStack>
      </Center>
    </>
  );
}

export default Home;
