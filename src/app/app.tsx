"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("~/components/Game"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Minesweeper" }
) {
  return <Game title={title} />;
}
