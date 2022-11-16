import { Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function Home() {
  return (
    <>
      <Heading>welcome to poru.</Heading>
      <Link as={RouterLink} to="/create">
        create a poll?
      </Link>
    </>
  );
}

export default Home;
