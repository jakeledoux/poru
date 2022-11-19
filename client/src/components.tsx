import {
  Text,
  Image,
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Tag,
  VStack,
} from "@chakra-ui/react";
import logo from "../img/poru.png";

export function BodyCard(props: any) {
  let cardProps: any = { align: props.align };

  switch (props.size) {
    case "sm":
      cardProps.width = "30em";
      break;
    case "md":
      cardProps.width = "30em";
      break;
    case "lg":
      cardProps.width = "50em";
  }

  return (
    <Center>
      <Card backgroundColor="white" padding={4} {...cardProps}>
        <VStack align="left">
          {!!props.title && (
            <>
              <Heading>{props.title}</Heading>
              {!!props.tags && (
                <HStack>
                  {props.tags.map((text: string, i: number) => (
                    <Tag key={i}>{text}</Tag>
                  ))}
                </HStack>
              )}
              {props.children && <Divider />}
            </>
          )}
          {props.children}
        </VStack>
      </Card>
    </Center>
  );
}

BodyCard.defaultProps = {
  size: "lg",
};

export function Note(props: any) {
  return (
    <Card backgroundColor="#f9f9f0" padding={4}>
      <HStack>
        <Image boxSize="3em" src={logo} alt="poru logo" />
        <Text>poru-chan says:</Text>
      </HStack>
      <Divider marginY={1} />
      <Text fontStyle="italic">{props.children}</Text>
    </Card>
  );
}
