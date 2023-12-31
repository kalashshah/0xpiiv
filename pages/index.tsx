import React from "react";
import Image from "next/image";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/utils/config";
import { Inter } from "next/font/google";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QRCode } from "react-qr-svg";
import QRJson from "../qrcodes/eligibility_qrcode.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [dateOfBirth, setDateOfBirth] = React.useState<string | null>(null);
  const [showQR, setShowQR] = React.useState<boolean>(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_URL;
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">pages/index.tsx</code>
        </p>
        <div className="bottom-0 left-0 flex items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black static h-auto w-auto lg:bg-none my-24 lg:my-0">
          <ConnectButton />
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/boilr3.svg"
          alt="BOILR3 Logo"
          width={250}
          height={37}
          priority
        />
      </div>
      <button onClick={() => setShowQR(true)}>SHOW QR</button>
      {showQR && (
        <div style={{ backgroundColor: "white", padding: 10 }}>
          <QRCode style={{ width: 256 }} value={JSON.stringify(QRJson)} />
        </div>
      )}
    </main>
  );
}
