import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";


export default function ReplyEmail({message,reply,username} :any) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reply to your Yokai message</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reply to your message</Preview>
      <Section>
        <Row>
          <Heading as="h2">Your Sent Message</Heading>
        </Row>
        <Row>
          <Text>
            {message}
          </Text>
        </Row>
        <Row>
          <Heading as="h2">Reply By {username}</Heading>
        </Row>
        <Row>
          <Text>{reply}</Text> 
        </Row>
        {/* <Row>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{ color: '#61dafb' }}
          >
            Verify here
          </Button>
        </Row> */}
      </Section>
    </Html>
  );
}
