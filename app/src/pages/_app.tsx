import type { AppProps } from 'next/app';
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='light' themes={['light', 'dark', 'instructor', 'student']}>
        <Component {...pageProps} />
      </NextThemesProvider>        
    </NextUIProvider>
      
    
  );
}
