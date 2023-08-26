import "./globals.css";
import { Inter } from "next/font/google";
import logoImg from "./logo.svg";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Velocity | Attendee Portal",
  description:
    "Momentum Developer Conference Schedule, Speaker Profiles, Session Feedback, and more!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="flex justify-between items-center px-4">
          <Link href="/">
            <Image src={logoImg} alt="Momentum" width={64} height={64} />
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
