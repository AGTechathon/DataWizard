import Loading from './loading';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import Provider from "./provider";
import "./globals.css";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Suspense fallback={<Loading />}>
              <Provider>
                {children}
              </Provider>
            </Suspense>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}git commit -m "Added Stack Auth" 