import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import _ from "lodash";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CREATE_POLL = gql`
  mutation CreatePoll($title: String!, $options: [String]!) {
    createPoll(title: $title, options: $options) {
      id
    }
  }
`;

function validatePoll(title: string, options: string[]) {
  title = title.trim();
  if (!title.length) {
    return [false, "title cannot be blank!"];
  }
  options = options.map((option) => option.trim()).filter((option) => option);
  if (options.length < 2) {
    return [false, "not enough options!"];
  }

  return [true, null];
}

function Create() {
  let [title, setTitle] = useState("");
  let [options, setOptions] = useState(["", ""]);

  const navigate = useNavigate();
  const [createPoll, mutation] = useMutation(CREATE_POLL);

  useEffect(() => {
    if (mutation.data) {
      navigate(`/poll/${mutation.data.createPoll.id}`);
    }
  }, [mutation]);

  return (
    <>
      <Heading>Create Poll</Heading>
      <Card>
        <Text>Poll Title</Text>
        <Input
          placeholder="Poll title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Divider />
        <Text>Options</Text>
        {options.map((option, i) => (
          <Box key={i}>
            <Input
              placeholder={`Option ${i + 1}`}
              value={option}
              onChange={(event) => {
                let newOptions = options.slice();
                newOptions[i] = event.target.value;
                setOptions(newOptions);
              }}
            />
            <Button
              isDisabled={options.length == 1}
              onClick={() => {
                let newOptions = options.slice();
                _.pullAt(newOptions, i);
                setOptions(newOptions);
              }}
            >
              X
            </Button>
          </Box>
        ))}

        {/* resize list */}
        <ButtonGroup>
          <Button onClick={() => setOptions(options.concat(""))}>Add</Button>
        </ButtonGroup>
      </Card>

      <Button
        isLoading={mutation.loading}
        onClick={() => {
          let [valid, message] = validatePoll(title, options);
          if (!valid) {
            return alert(message);
          }
          createPoll({ variables: { title: title, options: options } });
        }}
      >
        Publish poll
      </Button>
    </>
  );
}

export default Create;
