import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import * as _ from "lodash";

function Create() {
  let [pollTitle, setPollTitle] = useState("");
  let [options, setOptions] = useState(["", ""]);

  return (
    <>
      <Heading>Create Poll</Heading>
      <Card>
        <Text>Poll Title</Text>
        <Input
          placeholder="Poll title"
          value={pollTitle}
          onChange={(event) => setPollTitle(event.target.value)}
        />
        <Divider />
        <Text>Options</Text>
        {options.map((option, i) => (
          <>
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
          </>
        ))}

        {/* resize list */}
        <ButtonGroup>
          <Button onClick={() => setOptions(options.concat(""))}>Add</Button>
        </ButtonGroup>
      </Card>

      <Button>Publish poll</Button>
    </>
  );
}

export default Create;
