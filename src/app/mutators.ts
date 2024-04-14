import type { WriteTransaction } from "@rocicorp/reflect";

export type SessionAttendance = {
  id: string;
  bookmarked: boolean;
};

export const defaultSession = (id: string): SessionAttendance => ({
  id,
  bookmarked: false,
});

export const mutators = {
  toggleBookmark,
};

async function toggleBookmark(tx: WriteTransaction, sessionId: string) {
  // const value = (await tx.get<number>("count")) ?? 0;
  // await tx.set("count", value + delta);
  const session = await tx.get<SessionAttendance>(`session:${sessionId}`);
  if (session) {
    return tx.set(`session:${sessionId}`, {
      ...session,
      bookmarked: !session.bookmarked,
    });
  }
  await tx.set(`session:${sessionId}`, { id: sessionId, bookmarked: true });
}
