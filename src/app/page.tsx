'use client'; // Ditambahkan karena kita akan menggunakan useEffect untuk logika klien

import { Metadata } from "next";
import App from "./app";
import { useEffect, useState } from "react"; // Impor useEffect dan useState

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
  const [showSplash, setShowSplash] = useState(true); // State untuk mengontrol splash screen

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // Sembunyikan splash
      window.location.href = "https://blepblopia-translator.vercel.app/"; // Redirect
    }, 3000); // 3 detik

    return () => clearTimeout(timer); // Bersihkan timer saat komponen unmount
  }, []);

  return (
    <div>
      {showSplash ? (
        <div style={splashStyle}>
          <img
            src={`${appUrl}/splash.png`}
            alt="Splash Screen"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      ) : (
        <App /> // Tampilkan komponen App setelah splash selesai (opsional)
      )}
    </div>
  );
}

// Gaya untuk splash screen
const splashStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#ffffff", // Sesuai splashBackgroundColor di frame
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
} as const;
