"use client";
import { useUser } from "@clerk/nextjs";
import { remult } from "remult";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBookmark, FaRegBookmark, FaSpinner } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { PropsWithChildren, useEffect } from "react";
import { Session } from "@/sessionize";
import clsx from "clsx";
import { remultLocal } from "./local";
import { AttendanceRecord } from "../attendance-entity";

const attendanceRepo = remult.repo(AttendanceRecord);
const attendanceLocalRepo = remultLocal.repo(AttendanceRecord);

const getAttendanceRepo = (user: any) =>
  user ? attendanceRepo : attendanceLocalRepo;

function useBookmark(sessionId: string) {
  const { user } = useUser();
  const userId = user?.id || "local";

  const repo = getAttendanceRepo(user);

  const qc = useQueryClient();

  const { data: attendanceRecords } = useQuery(
    [`attendance`, { userId, sessionId }],
    () =>
      repo.find({ where: { userId, sessionId }, orderBy: { version: "asc" } }),
  );
  console.log(sessionId, { attendanceRecords });
  const isBookmarked = attendanceRecords?.reduce((res, record) => {
    if (record.event.type === "added-to-bookmarks") return true;
    if (record.event.type === "removed-from-bookmarks") return false;
    return res;
  }, false);

  async function toggleBookmark() {
    try {
      if (isBookmarked) {
        await AttendanceRecord.push(
          {
            sessionId,
            userId,
            event: { type: "removed-from-bookmarks" },
          },
          repo,
        );
      } else {
        await AttendanceRecord.push(
          {
            sessionId,
            userId,
            event: { type: "added-to-bookmarks" },
          },
          repo,
        );
      }
      qc.invalidateQueries([`attendance`, { userId, sessionId }]);
    } catch (err) {
      console.error(err);
    }
  }

  return { isBookmarked, toggleBookmark };
}

export function BookmarkComponent({ session }: { session: Session }) {
  const { toast, toasts, dismiss } = useToast();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(dismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dismiss]);

  const { isBookmarked, toggleBookmark } = useBookmark(session.id);

  const { mutate, status } = useMutation(async function () {
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
      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {status === "loading" ? (
        <FaSpinner className="animate-spin" />
      ) : isBookmarked ? (
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
