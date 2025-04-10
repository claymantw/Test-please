'use client';

import { useEffect, useState } from "react";
import App from "./app"; // Pastikan path ini sesuai

export default function Splash() {
  const [showSplash, setShowSplash] = useState(true);
  const appUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      window.location.href = "https://blepblopia-translator.vercel.app/";
    }, 3000); // 3 detik

    return () => clearTimeout(timer);
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
        <App /> // Tampilkan App jika redirect gagal atau dibatalkan
      )}
    </div>
  );
}

const splashStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#ffffff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
} as const;
