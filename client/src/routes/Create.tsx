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
import { useEffect } from "react";
import _ from "lodash";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FieldArray, Form, Formik } from "formik";

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
  const [createPoll, mutation] = useMutation(CREATE_POLL);

  useEffect(() => {
    if (mutation.data) {
      navigate(`/poll/${mutation.data.createPoll.id}`);
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
        {({ values, errors, handleChange, isValid, dirty }) => (
          <Form>
            <Heading>Create Poll</Heading>
            <Center>
              <Card width="30em" padding={4}>
                <VStack align="left">
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
                              colorScheme="red"
                              variant="outline"
                              isDisabled={values.options.length == 1}
                              borderLeftRadius={0}
                              onClick={() => arrayHelpers.remove(i)}
                            >
                              X
                            </Button>
                          </Flex>
                        ))}
                        <Button onClick={() => arrayHelpers.push("")}>
                          Add Option
                        </Button>
                      </>
                    )}
                  />

                  <Divider />

                  <Button
                    colorScheme="teal"
                    isDisabled={!isValid || !dirty}
                    isLoading={mutation.loading}
                    type="submit"
                  >
                    Publish
                  </Button>
                </VStack>
              </Card>
            </Center>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Create;
