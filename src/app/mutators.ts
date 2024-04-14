import type { WriteTransaction } from "@rocicorp/reflect";

export type SessionAttendance = {
  id: string;
  bookmarked: boolean;
  rating?: number;
  review?: string;
};

export const mutators = {
  toggleBookmark,
  rateSession,
  reviewSession,
};

async function toggleBookmark(tx: WriteTransaction, sessionId: string) {
  const session = await tx.get<SessionAttendance>(`session:${sessionId}`);
  if (session) {
    return tx.set(`session:${sessionId}`, {
      ...session,
      bookmarked: !session.bookmarked,
    });
  }
  await tx.set(`session:${sessionId}`, { id: sessionId, bookmarked: true });
}

async function rateSession(
  tx: WriteTransaction,
  {
    sessionId,
    rating,
  }: {
    sessionId: string;
    rating: 0 | 1 | 2;
  },
) {
  const session = await tx.get<SessionAttendance>(`session:${sessionId}`);
  if (session) {
    return tx.set(`session:${sessionId}`, {
      ...session,
      rating,
    });
  }
  await tx.set(`session:${sessionId}`, { id: sessionId, rating });
}

async function reviewSession(
  tx: WriteTransaction,
  {
    sessionId,
    review,
  }: {
    sessionId: string;
    review: string;
  },
) {
  const session = await tx.get<SessionAttendance>(`session:${sessionId}`);
  if (session) {
    return tx.set(`session:${sessionId}`, {
      ...session,
      review,
    });
  }
  await tx.set(`session:${sessionId}`, { id: sessionId, review });
}
