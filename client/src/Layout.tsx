import { gql, useLazyQuery } from "@apollo/client";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  HStack,
  useTheme,
  Heading,
  Button,
  Spacer,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

const GET_RANDOM_POLL = gql`
  query GetRandomPollId {
    random {
      id
    }
  }
`;

function Header() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams, _setSearchParams] = useSearchParams();
  const [getRandomPoll, { loading, error, data: _ }] = useLazyQuery(
    GET_RANDOM_POLL,
    {
      fetchPolicy: "no-cache",
      onCompleted: (data) => navigate(`/poll/${data.random.id}`),
    }
  );

  const shareId = searchParams.get("share");
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <Box padding="1em" minHeight="100vh" width="100vw" paddingTop="0">
      {/* website header section */}
      <Box marginBottom="1em" sx={{ boxShadow: "0 2px 0 0 #EEE" }}>
        {/* navigation bar */}
        <Box paddingX="1em" marginX="-1em" bg={theme.colors.secondary.main}>
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

        {/* poll posted alert */}
        {!!shareId && (
          <Alert marginX="-1em" width="100vw" status="success">
            <AlertIcon />
            <HStack>
              <Text>Your poll is now live!</Text>
              <Link
                onClick={() => {
                  navigator.clipboard.writeText(
                    `http://localhost:5173/poll/${shareId}`
                  );
                  setCopied(shareId);
                }}
              >
                {copied == shareId ? "Link copied" : "Click here to copy link."}
              </Link>
            </HStack>
          </Alert>
        )}
      </Box>

      {/* website content */}
      <Outlet />
    </Box>
  );
}

export default Header;
