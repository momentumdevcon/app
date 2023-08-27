import { Bookmark } from "@/app/(bookmarks)/entity";
import { auth } from "@clerk/nextjs";
import { remultNextApp } from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";
import { env } from "@/env";

const api = remultNextApp({
  entities: [Bookmark],
  getUser: async () => {
    const { userId } = auth();
    if (userId) return { id: userId };
  },
  dataProvider: createPostgresDataProvider({
    connectionString: env.POSTGRES_URL,
    sslInDev: true,
  }),
});

export const { GET, POST, PUT, DELETE } = api;
