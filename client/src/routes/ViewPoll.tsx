import { gql, useMutation, useQuery } from "@apollo/client";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Progress,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Tag,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { BodyCard } from "../components";
import { formatTs, pluralize } from "../utils";

const CAST_VOTE = gql`
  mutation CastVote($pollId: Int!, $optionId: Int!) {
    vote(pollId: $pollId, optionId: $optionId) {
      id
    }
  }
`;
const GET_POLL = gql`
  query GetPoll($pollId: Int!) {
    poll(id: $pollId) {
      id
      created
      title
      options {
        id
        text
        votes
      }
    }
  }
`;

type PollOption = {
  id: number;
  text: string;
  votes: number;
};

type Poll = {
  id: number;
  created: string;
  title: string;
  options: PollOption[];
};

function ViewPoll() {
  let [vote, setVote] = useState<string | undefined>(undefined);

  const params = useParams();
  const pollId = parseInt(params.pollId as string);

  const [castVote, mutation] = useMutation(CAST_VOTE, {
    refetchQueries: ["GetPoll"],
    onCompleted: () => cookies.set(`voted-${params.pollId}`, vote),
  });
  const { loading, error, data } = useQuery(GET_POLL, {
    variables: { pollId: pollId },
    pollInterval: 5000,
    fetchPolicy: "cache-and-network",
  });

  const cookies = new Cookies();
  let priorVote = cookies.get(`voted-${params.pollId}`);
  let hasVoted = mutation.data != null || priorVote;
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
  const poll = data.poll as Poll;
  const totalVotes = poll.options
    .map((option) => option.votes)
    .reduce((a, b) => a + b);
  const mostVotes = Math.max(
    1,
    poll.options.map((option) => option.votes).reduce((a, b) => (a > b ? a : b))
  );
  const voteScale = 100 / totalVotes;

  return (
    <Center>
      <Stack direction="column">
        <BodyCard
          title={poll.title}
          size="lg"
          tags={[
            formatTs(poll.created),
            `${totalVotes.toLocaleString()} ${pluralize("vote", totalVotes)}`,
          ]}
        >
          {viewResults ? (
            <Stack direction="column" divider={<Divider />}>
              {poll.options.map((option, i) => {
                let isWinner = option.votes == mostVotes;
                return (
                  <Box key={i}>
                    <HStack marginBottom={1}>
                      <Text>{option.text}</Text>
                      {priorVote == option.id && (
                        <Tag colorScheme="green">
                          <TagLeftIcon as={CheckIcon} />
                          voted
                        </Tag>
                      )}
                    </HStack>
                    <Box position="relative">
                      <Progress
                        hasStripe={isWinner}
                        colorScheme={isWinner ? "yellow" : "teal"}
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
                        {option.votes.toLocaleString()}{" "}
                        {pluralize("vote", option.votes)}
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
                );
              })}
            </Stack>
          ) : (
            <RadioGroup
              colorScheme="teal"
              value={vote}
              onChange={(value) => setVote(value)}
            >
              <Stack direction="column">
                {poll.options.map((option, i) => (
                  <Radio size="lg" value={option.id.toString()} key={i}>
                    {option.text}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          )}
        </BodyCard>
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
              Vote
            </Button>
            <Button
              colorScheme="blackAlpha"
              variant="outline"
              onClick={() => setSkipVote(true)}
            >
              Skip to Results
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
}

export default ViewPoll;
