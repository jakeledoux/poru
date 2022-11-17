import {
  Card,
  Center,
  Divider,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function About() {
  return (
    <>
      <VStack align="left">
        <Heading>About</Heading>
        <Divider />
        <Text>
          poru is a simple polling website to demonstrate abilities in web
          development using React. this project utilizes the following
          technologies:
        </Text>
        <VStack gap={1}>
          <Card padding={4}>
            <Heading size="md">Frontend</Heading>
            <Divider marginBottom={2} />

            <UnorderedList width="30em">
              <ListItem>
                <Link
                  as={RouterLink}
                  to="https://github.com/chakra-ui/chakra-ui"
                  isExternal
                >
                  Chakra UI
                </Link>{" "}
                for UI components
              </ListItem>
              <ListItem>
                <Link
                  as={RouterLink}
                  to="https://github.com/apollographql/apollo-client"
                  isExternal
                >
                  Apollo Client
                </Link>{" "}
                for API queries
              </ListItem>
              <ListItem>
                <Link
                  as={RouterLink}
                  to="https://github.com/remix-run/react-router"
                  isExternal
                >
                  React Router
                </Link>{" "}
                for... routing react (allowing page navigation)
              </ListItem>
            </UnorderedList>
          </Card>
          <Card padding={4}>
            <Heading size="md">Backend</Heading>
            <Divider marginBottom={2} />

            <UnorderedList width="30em">
              <ListItem>
                <Link
                  as={RouterLink}
                  to="https://github.com/apollographql/apollo-server"
                  isExternal
                >
                  Apollo Server
                </Link>{" "}
                for providing the GraphQL API
              </ListItem>
              <ListItem>
                <Link
                  as={RouterLink}
                  to="https://github.com/remix-run/react-router"
                  isExternal
                >
                  Yadayada
                </Link>{" "}
                for connecting to the database
              </ListItem>
            </UnorderedList>
          </Card>
        </VStack>
      </VStack>
    </>
  );
}

export default About;
