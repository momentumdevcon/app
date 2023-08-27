"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { remult } from "remult";
import { Bookmark } from "./entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { PropsWithChildren, useEffect } from "react";
import { Session } from "@/sessionize";
import clsx from "clsx";

const bookmarkRepo = remult.repo(Bookmark);

export function BookmarkComponent({ session }: { session: Session }) {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { toast, toasts, dismiss } = useToast();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(dismiss, 50000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const qc = useQueryClient();
  const { data: bookmarks } = useQuery(
    [`bookmarks`, user?.id],
    () => bookmarkRepo.find(),
    { enabled: !!user?.id }
  );

  const bookmark = bookmarks?.find((b) => b.sessionId === session.id);

  const { mutate: toggleBookmark } = useMutation(
    async function () {
      if (!user) {
        openSignIn();
        return;
      }

      if (bookmark) {
        await bookmarkRepo.delete(bookmark);
        toast({
          title: `${session.title.substring(0, 30)}... removed from bookmarks`,
          className: "bg-red-800 m-auto bg-opacity-90 border-none",
        });
      } else {
        await bookmarkRepo.insert({
          userId: user?.id,
          sessionId: session.id,
        });
        toast({
          title: `${session.title.substring(0, 30)}... added to bookmarks`,
          className: "bg-green-800 m-auto bg-opacity-90 border-none",
        });
      }
    },
    {
      onSuccess: () => {
        qc.invalidateQueries([`bookmarks`]);
      },
      onError: () => {
        toast({
          title: `Error saving bookmarks, please try again`,
          className: "bg-red-800 m-auto bg-opacity-90 border-none",
        });
      },
    }
  );

  return (
    <button
      className="text-2xl"
      onClick={() => toggleBookmark()}
      title={bookmark ? "Remove bookmark" : "Add bookmark"}
    >
      {bookmark ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
}

export function SessionWithBookmark({
  session,
  className,
  children,
}: PropsWithChildren<{ session: Session; className: string }>) {
  const { user } = useUser();
  const { data } = useQuery(
    [`bookmarks`, user?.id],
    () => bookmarkRepo.find(),
    {
      enabled: !!user?.id,
    }
  );

  const bookmark = data?.find((b) => b.sessionId === session.id);

  return (
    <div
      className={clsx(className, bookmark ? "bg-momentum" : "border-gray-700")}
    >
      {children}
    </div>
  );
}
