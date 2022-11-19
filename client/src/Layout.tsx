import { gql, useLazyQuery } from "@apollo/client";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  useTheme,
  Heading,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [getRandomPoll, { loading, error, data: _ }] = useLazyQuery(
    gql`
      query GetRandomPollId {
        random {
          id
        }
      }
    `,
    {
      fetchPolicy: "no-cache",
      onCompleted: (data) => navigate(`/poll/${data.random.id}`),
    }
  );

  return (
    <Box padding="1em" minHeight="100vh" width="100vw" paddingTop="0">
      <Box
        bg={theme.colors.secondary.main}
        paddingX="1em"
        marginX="-1em"
        marginBottom="1em"
      >
        <HStack height="3em">
          <Heading
            size="lg"
            color="blackAlpha.700"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            poru!
          </Heading>
          <Spacer />

          <Button
            size="sm"
            colorScheme="teal"
            leftIcon={<AddIcon />}
            onClick={() => navigate("/create")}
          >
            あど
          </Button>
          <Button
            size="sm"
            colorScheme="teal"
            variant="ghost"
            isLoading={loading}
            isDisabled={!!error}
            onClick={() => getRandomPoll()}
          >
            {error ? "error!" : "ランダム"}
          </Button>
          <Button
            size="sm"
            colorScheme="teal"
            variant="ghost"
            onClick={() => navigate("/about")}
          >
            約
          </Button>
        </HStack>
      </Box>

      <Outlet />
    </Box>
  );
}

export default Header;
