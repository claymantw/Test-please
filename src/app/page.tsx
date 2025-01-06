import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/og-image.png?v=2`,
  button: {
    title: "Play Minesweeper",
    action: {
      type: "launch_frame",
      name: "Minesweeper",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Minesweeper",
    openGraph: {
      title: "Minesweeper",
      description: "The classic puzzle game in a Farcaster Frame.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (<App />);
}
