
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@styles/reset.css";
import "@styles/globals.css";
import 'boxicons/css/boxicons.min.css';
import { AlertProvider } from "@components/alert/alertContext";
import ConditionalHeader from "@components/ConditionalHeader";
import ConditionalFooter from "@components/ConditionalFooter";


const Oxygen = localFont({
  src: "../../src/shared/fonts/OxygenRegular.woff",
  variable: "--font-oxygen-sans",
  weight: "100 900 bold",
});


export const metadata: Metadata = {
  title: "IB-Craft",
  description: "IB-Craft Web Site",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${Oxygen.variable} soid`}>
          <AlertProvider>
            <ConditionalHeader />
            {children}
            <ConditionalFooter />
          </AlertProvider>
      </body>
    </html>
  );
}
