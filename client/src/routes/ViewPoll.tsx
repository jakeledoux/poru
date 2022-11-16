import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Heading,
  Progress,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CAST_VOTE = gql`
  mutation CastVote($pollId: Int!, $optionId: Int!) {
    vote(pollId: $pollId, optionId: $optionId) {
      id
      title
      options {
        id
        text
        votes
      }
    }
  }
`;
const GET_POLL = gql`
  query GetPoll($pollId: Int!) {
    poll(id: $pollId) {
      title
      options {
        text
        votes
      }
    }
  }
`;

type PollOption = {
  text: string;
  votes: number;
};

type Poll = {
  title: string;
  options: PollOption[];
};

function ViewPoll() {
  let [vote, setVote] = useState<string | undefined>(undefined);

  const params = useParams();
  const pollId = parseInt(params.pollId as string);

  const [castVote, mutation] = useMutation(CAST_VOTE);
  const { loading, error, data } = useQuery(GET_POLL, {
    variables: { pollId: pollId },
  });

  let hasVoted = mutation.data != null;
  let [skipVote, setSkipVote] = useState(false);
  let viewResults = hasVoted || skipVote;

  if (loading) {
    return <Spinner />;
  } else if (error) {
    console.error(error);
    throw new Response("Error!", { status: 500 });
  }

  if (data.poll == null) {
    throw new Response("Poll does not exist!", { status: 404 });
  }
  const poll = (mutation.data ? mutation.data.vote : data.poll) as Poll;
  const mostVotes = poll.options
    .map((option) => option.votes)
    .reduce((a, b) => (a > b ? a : b));
  const voteScale = 100 / mostVotes;

  return (
    <Center>
      <Stack direction="column">
        <Card padding={4} width="50em">
          <Heading>{poll.title}</Heading>
          <Divider marginBottom={4} />
          {viewResults ? (
            <Stack direction="column" divider={<Divider />}>
              {poll.options.map((option, i) => (
                <Box key={i}>
                  <Text>{option.text}</Text>
                  <Box position="relative">
                    <Progress
                      hasStripe={option.votes == mostVotes}
                      colorScheme={
                        option.votes == mostVotes ? "yellow" : "teal"
                      }
                      borderRadius={5}
                      height="32px"
                      value={option.votes * voteScale}
                    />
                    <Text
                      color="white"
                      top={0}
                      bottom={0}
                      marginY="auto"
                      marginLeft={2}
                      height="max-content"
                      position="absolute"
                      fontWeight="bold"
                    >
                      {option.votes.toLocaleString()} vote
                      {option.votes == 1 ? "" : "s"}
                    </Text>
                    <Text
                      color="white"
                      top={0}
                      bottom={0}
                      right={0}
                      marginY="auto"
                      marginRight={2}
                      height="max-content"
                      position="absolute"
                      fontWeight="bold"
                    >
                      {Math.round(option.votes * voteScale)}%
                    </Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <RadioGroup
              colorScheme="teal"
              value={vote}
              onChange={(value) => setVote(value)}
            >
              <Stack direction="column">
                {poll.options.map((option, i) => (
                  <Radio size="lg" value={`${i}`} key={i}>
                    {option.text}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          )}
        </Card>
        {!viewResults && (
          <>
            <Button
              colorScheme="teal"
              isDisabled={vote == undefined}
              isLoading={mutation.loading}
              onClick={() =>
                castVote({
                  variables: {
                    pollId: pollId,
                    optionId: parseInt(vote as string),
                  },
                })
              }
            >
              vote
            </Button>
            <Button
              colorScheme="blackAlpha"
              variant="outline"
              onClick={() => setSkipVote(true)}
            >
              view results
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
}

export default ViewPoll;
