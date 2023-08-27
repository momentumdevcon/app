"use client";
import { useUser } from "@clerk/nextjs";
import { remult } from "remult";
import { Bookmark } from "./entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBookmark, FaRegBookmark, FaSpinner } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { PropsWithChildren, useEffect } from "react";
import { Session } from "@/sessionize";
import clsx from "clsx";
import { remultLocal } from "./local";

const bookmarkRepo = remult.repo(Bookmark);
const bookmarkLocalRepo = remultLocal.repo(Bookmark);

const getBookmarkRepo = (user: any) =>
  user ? bookmarkRepo : bookmarkLocalRepo;

function useBookmarks() {
  const { user } = useUser();
  const userId = user?.id || "local";

  const repo = getBookmarkRepo(user);

  const qc = useQueryClient();

  const { data: bookmarks } = useQuery([`bookmarks`, userId], () =>
    repo.find()
  );

  async function toggleBookmark(
    sessionId: string,
    existingBookmark?: Bookmark
  ) {
    if (existingBookmark) {
      await repo.delete(existingBookmark);
    } else {
      await repo.insert({ userId, sessionId });
    }
    qc.invalidateQueries([`bookmarks`]);
  }

  return { bookmarks, toggleBookmark };
}

export function BookmarkComponent({ session }: { session: Session }) {
  const { toast, toasts, dismiss } = useToast();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(dismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const { bookmarks, toggleBookmark } = useBookmarks();

  const bookmark = bookmarks?.find((b) => b.sessionId === session.id);

  const { mutate, status } = useMutation(async function () {
    try {
      if (bookmark) {
        await toggleBookmark(session.id, bookmark);
        toast({
          title: `${session.title.substring(0, 30)}... removed from bookmarks`,
          className: "bg-red-800 m-auto bg-opacity-90 border-none",
        });
      } else {
        await toggleBookmark(session.id);
        toast({
          title: `${session.title.substring(0, 30)}... added to bookmarks`,
          className: "bg-green-800 m-auto bg-opacity-90 border-none",
        });
      }
    } catch (e) {
      toast({
        title: `Error saving bookmarks, please try again`,
        className: "bg-red-800 m-auto bg-opacity-90 border-none",
      });
    }
  });

  return (
    <button
      className="text-2xl"
      onClick={() => mutate()}
      title={bookmark ? "Remove bookmark" : "Add bookmark"}
    >
      {status === "loading" ? (
        <FaSpinner />
      ) : bookmark ? (
        <FaBookmark />
      ) : (
        <FaRegBookmark />
      )}
    </button>
  );
}

export function SessionWithBookmark({
  session,
  className,
  children,
}: PropsWithChildren<{ session: Session; className: string }>) {
  const { bookmarks } = useBookmarks();

  const bookmark = bookmarks?.find((b) => b.sessionId === session.id);

  return (
    <div
      className={clsx(className, bookmark ? "bg-momentum" : "border-gray-700")}
    >
      {children}
    </div>
  );
}
