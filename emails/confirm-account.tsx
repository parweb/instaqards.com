import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text
} from '@react-email/components';
import * as React from 'react';

interface ConfirmAccountProps {
  confirmLink?: string;
}

const baseUrl = (
  process.env?.NEXTAUTH_URL ?? 'http://app.localhost:11000'
).replace('app.', '');

export const ConfirmAccount = ({ confirmLink }: ConfirmAccountProps) => (
  <Html>
    <Head />

    <Preview>Confirm your email</Preview>

    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm your email</Heading>

        <Link
          href={confirmLink}
          target="_blank"
          style={{
            ...link,
            display: 'block',
            marginBottom: '16px'
          }}
        >
          Click here to confirm your email
        </Link>

        <Text
          style={{
            ...text,
            color: '#ababab',
            marginTop: '14px',
            marginBottom: '16px'
          }}
        >
          If you didn&apos;t try to create an account, you can safely ignore
          this email.
        </Text>

        <Img
          src={`${baseUrl}/logo.png`}
          width="32"
          height="32"
          alt="Instaqards's Logo"
        />

        <Text style={footer}>
          <Link
            href={baseUrl}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            {baseUrl.replace('https://', '').replace('http://', '')}
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

ConfirmAccount.PreviewProps = {
  confirmLink: 'sparo-ndigo-amurt-secan'
} as ConfirmAccountProps;

export default ConfirmAccount;

const main = {
  backgroundColor: '#ffffff'
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto'
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0'
};

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline'
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0'
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px'
};

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333'
};
