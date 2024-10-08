"use client";

import {useAppContext} from "@/hooks/use-app-context";

import {usePrivy} from "@privy-io/react-auth";

import {useWalletClient} from "wagmi";

import SignUpModal from "@/components/sign-up-modal";
import FullPageLoader from "@/components/loaders/full-page-loader";
import HeroSection from "@/components/ui/hero-section";
import ChatWindow from "@/components/chat-window";
import PWAPrompt from "@/components/pwa-prompt";

export default function Home() {
  const {data: signer} = useWalletClient();
  const {ready} = usePrivy();
  const {isUserAuthenticated} = useAppContext();

  const {pushUser} = useAppContext();

  return (
    <PWAPrompt>
      <main className="flex min-h-screen min-w-screen flex-col items-center">
        {signer && !pushUser && <SignUpModal />}
        {!pushUser && <HeroSection />}
        {pushUser && <ChatWindow />}
        {!isUserAuthenticated && !ready && <FullPageLoader />}
      </main>
    </PWAPrompt>
  );
}
