import {
  Box,
  Divider,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BodyCard } from "../components";

function TechList(props: { title: string; items: [string, string, string][] }) {
  return (
    <Box marginLeft={3} paddingLeft={3} borderLeft="2px solid teal">
      <Heading size="md">{props.title}</Heading>
      <Divider marginBottom={2} />
      <UnorderedList width="30em">
        {props.items.map(([name, reason, link], i) => (
          <ListItem key={i}>
            <Link as={RouterLink} to={link} isExternal>
              {name}
            </Link>{" "}
            for {reason}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

function About() {
  return (
    <>
      <BodyCard title="About">
        <Text>
          poru is a simple polling website to demonstrate abilities in web
          development using React. this project utilizes the following
          technologies:
        </Text>
        <TechList
          title="Frontend"
          items={[
            [
              "Chakra UI",
              "UI components",
              "https://github.com/chakra-ui/chakra-ui",
            ],
            [
              "Apollo Client",
              "API queries",
              "https://github.com/apollographql/apollo-client",
            ],
            [
              "React Router",
              "routing react (allowing page navigation)",
              "https://github.com/remix-run/react-router",
            ],
          ]}
        />
        <TechList
          title="Backend"
          items={[
            [
              "Apollo Server",
              "providing the GraphQL API",
              "https://github.com/apollographql/apollo-server",
            ],
            [
              "Yadayada",
              "connecting to the database",
              "https://github.com/remix-run/react-router",
            ],
          ]}
        />
      </BodyCard>
    </>
  );
}

export default About;
