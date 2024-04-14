import "./globals.css";
import { Inter } from "next/font/google";
import logoImg from "./logo.svg";
import Image from "next/image";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Providers from "./provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Momentum | Attendee Portal",
  description:
    "Momentum Developer Conference Schedule, Speaker Profiles, Session Feedback, and more!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${inter.className} bg-black text-white`}>
          <header className="flex justify-between items-center px-4">
            <Link href="/">
              <Image src={logoImg} alt="Momentum" width={64} height={64} />
            </Link>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonPopoverActionButton__manageAccount: "hidden",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
          </header>
          {children}
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
