import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Card,
  Heading,
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

  return (
    <>
      <Card>
        <Heading>{poll.title}</Heading>
        {viewResults ? (
          <Stack direction="column">
            {poll.options.map((option, i) => (
              <Box key={i}>
                <Text>{option.votes}</Text>
                <Text>{option.text}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <RadioGroup value={vote} onChange={(value) => setVote(value)}>
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
          <Button onClick={() => setSkipVote(true)}>view results</Button>
        </>
      )}
    </>
  );
}

export default ViewPoll;
