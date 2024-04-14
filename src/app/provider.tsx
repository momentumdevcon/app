"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { SessionAttendanceProvider } from "./(bookmarks)/Bookmark";
import { ClerkProvider } from "@clerk/nextjs";

const qc = new QueryClient();

export default function Providers(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={qc}>
      <ClerkProvider>
        <SessionAttendanceProvider>{props.children}</SessionAttendanceProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
