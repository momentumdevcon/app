"use client";
import { useUser } from "@clerk/nextjs";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { Reflect } from "@rocicorp/reflect/client";
import { SessionAttendance, mutators } from "../mutators";
import { useSubscribe } from "@rocicorp/reflect/react";
import { Session } from "@/sessionize";

export const sessionAttendanceContext = createContext<
  Reflect<typeof mutators> | undefined
>(undefined);

export function SessionAttendanceProvider(props: { children: ReactNode }) {
  const { user } = useUser();
  const userId = user?.id;

  const [r, setR] = useState<Reflect<typeof mutators>>();

  useEffect(() => {
    if (!userId) return;

    setR(
      new Reflect({
        server: "http://localhost:8080",
        roomID: `sessions-${userId}`,
        userID: userId,
        mutators,
        kvStore: "idb",
      }),
    );
  }, [userId]);

  return (
    <sessionAttendanceContext.Provider value={r}>
      {props.children}
    </sessionAttendanceContext.Provider>
  );
}

function useBookmark(sessionId: string) {
  const r = useContext(sessionAttendanceContext);

  const session = useSubscribe(
    r,
    (tx) => tx.get<SessionAttendance>(`session:${sessionId}`),
    null,
  );

  async function toggleBookmark() {
    if (!r) throw new Error(`Something went wrong!`);
    await r.mutate.toggleBookmark(sessionId);
  }

  return { isBookmarked: session?.bookmarked, toggleBookmark };
}

export function BookmarkComponent({ session }: { session: Session }) {
  const { toast, toasts, dismiss } = useToast();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(dismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dismiss]);

  const { isBookmarked, toggleBookmark } = useBookmark(session.id);

  const mutate = async function () {
    try {
      await toggleBookmark();
      if (isBookmarked) {
        toast({
          title: `${session.title.substring(0, 30)}... removed from bookmarks`,
          className: "bg-green-800 m-auto bg-opacity-90 border-none",
        });
      } else {
        toast({
          title: `${session.title.substring(0, 30)}... added to bookmarks`,
          className: "bg-green-800 m-auto bg-opacity-90 border-none",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        title: `Error saving bookmarks, please try again`,
        className: "bg-red-800 m-auto bg-opacity-90 border-none",
      });
    }
  };

  return (
    <button
      className="text-2xl"
      onClick={() => mutate()}
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
}

export function SessionWithBookmark({
  session,
  className,
  children,
}: PropsWithChildren<{ session: Session; className: string }>) {
  const { isBookmarked } = useBookmark(session.id);

  return (
    <div
      className={clsx(
        className,
        isBookmarked ? "bg-momentum" : "border-gray-700",
      )}
    >
      {children}
    </div>
  );
}
