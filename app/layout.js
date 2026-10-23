import "./globals.css";
import { Topbar } from "@/components/common/Topbar/Topbar";
import SmoothScroll from "@/components/common/SmoothScroll/SmoothScroll";

export const metadata = {
  title: "Vishwas Portfolio",
  description: "Portfolio created with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Topbar />
        {children}
        <SmoothScroll />
      </body>
    </html>
  );
}
