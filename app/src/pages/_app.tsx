import type { AppProps } from 'next/app';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="840904295882-mu21shj3dc5lk519961jndun8pkiao0p.apps.googleusercontent.com">
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
