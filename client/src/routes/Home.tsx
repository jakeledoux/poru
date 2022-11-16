import { Heading, Link } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { Link as RouterLink } from "react-router-dom";

function Home() {
  const theme = useTheme();
  return (
    <>
      <Heading>welcome to poru.</Heading>
      <Link color={theme.colors.primary.main} as={RouterLink} to="/create">
        create a poll?
      </Link>
    </>
  );
}

export default Home;
