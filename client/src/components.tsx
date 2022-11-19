import {
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Tag,
  VStack,
} from "@chakra-ui/react";

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
      <Card padding={4} {...cardProps}>
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
