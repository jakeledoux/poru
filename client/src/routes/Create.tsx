import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import _ from "lodash";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

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
  const navigate = useNavigate();
  const [createPoll, mutation] = useMutation(CREATE_POLL);

  useEffect(() => {
    if (mutation.data) {
      navigate(`/poll/${mutation.data.createPoll.id}`);
    }
  }, [mutation]);

  const formik = useFormik({
    initialValues: {
      title: "",
      options: [""],
    },
    onSubmit: (value) => {
      alert(JSON.stringify(value));
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Heading>Create Poll</Heading>
        <Center>
          <Card width="30em" padding={4}>
            <VStack align="left">
              <FormControl>
                <FormLabel htmlFor="title">Poll title</FormLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="ポルの題名"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
              </FormControl>
              <Divider />
              <Text>Options</Text>
              {formik.values.options.map((option, i) => (
                <Flex key={i}>
                  <Input
                    id={`options[${i}]`}
                    name={`options[${i}]`}
                    placeholder={`オプション ${i + 1}`}
                    value={option}
                    onChange={formik.handleChange}
                    borderRightRadius={0}
                    borderRight="hidden"
                  />
                  <Button
                    colorScheme="red"
                    variant="outline"
                    isDisabled={formik.values.options.length == 1}
                    borderLeftRadius={0}
                    onClick={() => {
                      // todo: remove option
                    }}
                  >
                    X
                  </Button>
                </Flex>
              ))}
              <Button onClick={() => {}}>Add Option</Button>

              <Divider />

              <Button
                colorScheme="teal"
                isLoading={mutation.loading}
                type="submit"
              >
                Publish poll
              </Button>
            </VStack>
          </Card>
        </Center>
      </form>
    </>
  );
}

export default Create;
