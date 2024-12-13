"use client";

import Script from 'next/script'

import { useEffect, useState } from "react";
import sdk, {
  type FrameContext,
} from "@farcaster/frame-sdk";
/*
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
  useSwitchChain,
  useChainId,
} from "wagmi";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { BaseError, UserRejectedRequestError } from "viem";
*/

export default function Game(
  { title }: { title?: string } = { title: "Minesweeper" }
) {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  // eslint-disable-next-line
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div id="container">
      <h1>{title}</h1>
      <div id="game">Loading...</div>
      <Script src={`${appUrl}/minesweeper.js`}></Script>
      <Script>
        startMinisweeper(document.getElementById('game')); 
      </Script>
    </div>
  );
}
