"use client";

import { AttendanceRecord } from "@/app/attendance-entity";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  BsEmojiFrownFill,
  BsEmojiNeutralFill,
  BsEmojiSmileFill,
} from "react-icons/bs";
import { FaArrowRight, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { remult } from "remult";

const attendanceRepo = remult.repo(AttendanceRecord);

export function Feedback({ sessionId }: { sessionId: string }) {
  const { toast, toasts, dismiss } = useToast();
  const { user } = useUser();
  const [state, setState] = useState<"rating" | "review">("rating");

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(dismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dismiss]);

  const userId = user?.id;
  const qc = useQueryClient();

  const { data: attendanceRecords, status: fetchStatus } = useQuery(
    [`attendance`, { userId, sessionId }],
    () => AttendanceRecord.fetch({ userId, sessionId }, attendanceRepo),
    { enabled: !!userId },
  );

  const hasRated = attendanceRecords
    ?.filter((r) => r.event.type === "rated")
    .pop();

  const hasReviewed = attendanceRecords
    ?.filter((r) => r.event.type === "reviewed")
    .pop();

  console.log({ hasRated, hasReviewed });

  const {
    mutateAsync: rateTalk,
    status: ratingStatus,
    variables: ratingArg,
  } = useMutation(async function rateTalk(reaction: 0 | 1 | 2) {
    if (!userId) {
      return null;
    }
    try {
      await AttendanceRecord.push(
        {
          sessionId,
          userId,
          event: { type: "rated", reaction },
        },
        attendanceRepo,
      );
      qc.invalidateQueries([`attendance`, { userId, sessionId }]);
      if (!hasRated) setState("review");
      toast({
        title: `Rating submitted!`,
        description: `Thanks for your feedback!`,
        className: "bg-green-800 m-auto bg-opacity-90 border-none",
      });
    } catch (err) {
      console.error(err);
    }
  });

  const { mutateAsync: reviewTalk, status: reviewStatus } = useMutation(
    async function reviewTalk(review: string) {
      if (!userId) {
        return null;
      }
      try {
        await AttendanceRecord.push(
          {
            sessionId,
            userId,
            event: { type: "reviewed", review },
          },
          attendanceRepo,
        );
        qc.invalidateQueries([`attendance`, { userId, sessionId }]);
        toast({
          title: `Review submitted!`,
          description: `Thanks for your feedback!`,
          className: "bg-green-800 m-auto bg-opacity-90 border-none",
        });
      } catch (err) {
        console.error(err);
      }
    },
  );

  const isCurrentlyRating = (rating: 0 | 1 | 2) =>
    ratingStatus === "loading" && ratingArg === rating;

  return (
    <>
      {fetchStatus === "success" && state === "rating" ? (
        <div className="bg-white rounded-sm text-sm bg-opacity-10 text-center my-2 pt-2">
          How was this talk?
          <div className="grid grid-cols-3">
            <button
              className="py-4 text-2xl flex justify-center bg-red-500 bg-opacity-50 rounded m-2 disabled:opacity-50 disabled:outline"
              disabled={
                // @ts-expect-error
                hasRated?.event.reaction === 0 || isCurrentlyRating(0)
              }
              onClick={() => rateTalk(0)}
            >
              {isCurrentlyRating(0) ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <BsEmojiFrownFill />
              )}
            </button>
            <button
              className="py-4 text-2xl flex justify-center bg-yellow-400 bg-opacity-50 rounded m-2 disabled:opacity-50 disabled:outline"
              disabled={
                // @ts-expect-error
                hasRated?.event.reaction === 1 || isCurrentlyRating(1)
              }
              onClick={() => rateTalk(1)}
            >
              {isCurrentlyRating(1) ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <BsEmojiNeutralFill />
              )}
            </button>
            <button
              className="py-4 text-2xl flex justify-center bg-green-500 bg-opacity-50 rounded m-2 disabled:opacity-50 disabled:outline"
              disabled={
                // @ts-expect-error
                hasRated?.event.reaction === 2 || isCurrentlyRating(2)
              }
              onClick={() => rateTalk(2)}
            >
              {isCurrentlyRating(2) ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <BsEmojiSmileFill />
              )}
            </button>
          </div>
          {hasRated && (
            <Button className="text-xs" onClick={() => setState("review")}>
              Review <FaArrowRight />
            </Button>
          )}
        </div>
      ) : state === "review" ? (
        <div className="bg-white rounded-sm text-sm bg-opacity-10 text-center my-2 pt-2 px-4">
          {hasReviewed ? (
            <>
              Your review has been submitted! <br /> You can update your review
              here
            </>
          ) : (
            <>
              Thanks for the rating! <br /> Would you like to write a review for
              this talk? <br />
            </>
          )}
          <form
            className="py-2 flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const reviewEl = e.currentTarget.review as HTMLTextAreaElement;
              await reviewTalk(reviewEl.value);
            }}
          >
            <textarea
              name="review"
              aria-label=""
              className="bg-gray-100 text-black w-full rounded p-2"
              // @ts-expect-error
              defaultValue={hasReviewed?.event.review}
              key={hasReviewed?.id}
            />
            <Button type="submit" className="bg-momentum rounded">
              {reviewStatus === "loading" ? (
                <FaSpinner className="animate-spin" />
              ) : (
                `Submit`
              )}
            </Button>
          </form>
          <Button className="text-xs" onClick={() => setState("rating")}>
            <FaArrowLeft /> Rating
          </Button>
        </div>
      ) : null}
    </>
  );
}
