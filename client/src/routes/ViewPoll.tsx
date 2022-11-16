import {
  Box,
  Button,
  Card,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

type PollOption = {
  text: string;
  votes: number;
};

type Poll = {
  title: string;
  options: PollOption[];
};

function ViewPoll() {
  let [hasVoted, setHasVoted] = useState(false);
  let [vote, setVote] = useState<string | undefined>(undefined);

  let poll: Poll = {
    title: "Which Portal is better?",
    options: [
      {
        text: "Portal 1",
        votes: 554,
      },
      {
        text: "Portal 2",
        votes: 6247,
      },
    ],
  };

  return (
    <>
      <Button onClick={() => setHasVoted(!hasVoted)}>
        (debug) toggle hasVoted
      </Button>
      <Card>
        <Heading>{poll.title}</Heading>
        {hasVoted ? (
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
      {!hasVoted && <Button isDisabled={vote == undefined}>vote</Button>}
    </>
  );
}

export default ViewPoll;
