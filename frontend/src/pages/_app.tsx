import { Toaster } from "@/components/ui/toaster";
import { ThemeLayout } from "@/layouts/ThemeLayout";
import store from "@/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeLayout
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <Component {...pageProps} />
      </ThemeLayout>
    </Provider>
  );
}
