import {
  Button,
  Center,
  Input,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import _ from "lodash";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FieldArray, Form, Formik } from "formik";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { BodyCard } from "../components";

const CREATE_POLL = gql`
  mutation CreatePoll($title: String!, $options: [String]!) {
    createPoll(title: $title, options: $options) {
      id
    }
  }
`;

function Error(props: { value: string | string[] | undefined }) {
  return typeof props.value === "string" ? (
    <Text color="red.500">{props.value}</Text>
  ) : (
    <></>
  );
}

function Create() {
  const navigate = useNavigate();
  const [revising, setRevising] = useState(false);
  const [createPoll, mutation] = useMutation(CREATE_POLL);

  useEffect(() => {
    if (mutation.data) {
      navigate(
        `/poll/${mutation.data.createPoll.id}?share=${mutation.data.createPoll.id}`
      );
    }
  }, [mutation]);

  return (
    <>
      <Formik
        initialValues={{
          title: "",
          options: [""],
        }}
        onSubmit={(values) => {
          createPoll({ variables: values });
        }}
        validateOnMount={false}
        validateOnChange={revising}
        validate={(values) => {
          let errors: any = {};

          let title = values.title.trim();
          if (!title.length) {
            errors.title = "Required";
          }
          let options = values.options
            .map((option) => option.trim())
            .filter((option) => option);
          if (options.length < 2) {
            errors.options = "Provide at least two options";
          }

          return errors;
        }}
      >
        {({ values, errors, handleChange }) => (
          <Form>
            <Center>
              <BodyCard title="Create Poll" size="md">
                <FormControl>
                  <FormLabel htmlFor="title">Poll title</FormLabel>
                  <Input
                    autoFocus
                    id="title"
                    name="title"
                    placeholder="ポルの題名"
                    onChange={handleChange}
                    value={values.title}
                    isInvalid={!!errors.title}
                  />
                  <Error value={errors.title} />
                </FormControl>
                <Divider />
                <FieldArray
                  name="options"
                  render={(arrayHelpers) => (
                    <>
                      <Text>Options</Text>
                      <Error value={errors.options} />
                      {values.options.map((option, i) => (
                        <Flex key={i}>
                          <Input
                            id={`options[${i}]`}
                            name={`options[${i}]`}
                            placeholder={`オプション ${i + 1}`}
                            value={option}
                            onChange={handleChange}
                            borderRightRadius={0}
                            borderRight="hidden"
                          />
                          <Button
                            colorScheme="gray"
                            variant="outline"
                            isDisabled={values.options.length == 1}
                            borderLeftRadius={0}
                            onClick={() => arrayHelpers.remove(i)}
                          >
                            <SmallCloseIcon
                              color={
                                values.options.length == 1
                                  ? "blackAlpha.200"
                                  : "red.500"
                              }
                            />
                          </Button>
                        </Flex>
                      ))}
                      <Button onClick={() => arrayHelpers.push("")}>Add</Button>
                    </>
                  )}
                />

                <Divider />

                <Button
                  colorScheme="teal"
                  isLoading={mutation.loading}
                  type="submit"
                  onClick={() => {
                    if (!revising) {
                      setRevising(true);
                    }
                  }}
                >
                  ポルをPublish
                </Button>
              </BodyCard>
            </Center>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Create;
