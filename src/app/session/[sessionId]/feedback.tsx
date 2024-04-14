"use client";

import { sessionAttendanceContext } from "@/app/(bookmarks)/Bookmark";
import { SessionAttendance } from "@/app/mutators";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSubscribe } from "@rocicorp/reflect/react";
import { useContext, useEffect, useState } from "react";
import {
  BsEmojiFrownFill,
  BsEmojiNeutralFill,
  BsEmojiSmileFill,
} from "react-icons/bs";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export function Feedback({ sessionId }: { sessionId: string }) {
  const { toast, toasts, dismiss } = useToast();
  const [state, setState] = useState<"rating" | "review">("rating");

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(dismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dismiss]);

  const r = useContext(sessionAttendanceContext);

  const session = useSubscribe(
    r,
    (tx) => tx.get<SessionAttendance>(`session:${sessionId}`),
    null,
  );

  const rateTalk = async function rateTalk(rating: 0 | 1 | 2) {
    try {
      if (!r) throw new Error(`Something went wrong`);
      await r.mutate.rateSession({ sessionId, rating });
      if (!session?.rating) setState("review");

      toast({
        title: `Rating submitted!`,
        description: `Thanks for your feedback!`,
        className: "bg-green-800 m-auto bg-opacity-90 border-none",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const reviewTalk = async function reviewTalk(review: string) {
    try {
      if (!r) throw new Error(`Something went wrong`);
      await r.mutate.reviewSession({ sessionId, review });
      toast({
        title: `Review submitted!`,
        description: `Thanks for your feedback!`,
        className: "bg-green-800 m-auto bg-opacity-90 border-none",
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!session) return null;

  return (
    <>
      {state === "rating" ? (
        <div className="bg-white rounded-sm text-sm bg-opacity-10 text-center my-2 pt-2">
          How was this talk?
          <div className="grid grid-cols-3">
            <button
              className="py-4 text-2xl flex justify-center bg-red-500 bg-opacity-50 rounded m-2 disabled:opacity-50 disabled:outline"
              disabled={session?.rating === 0}
              onClick={() => rateTalk(0)}
            >
              <BsEmojiFrownFill />
            </button>
            <button
              className="py-4 text-2xl flex justify-center bg-yellow-400 bg-opacity-50 rounded m-2 disabled:opacity-50 disabled:outline"
              disabled={session?.rating === 1}
              onClick={() => rateTalk(1)}
            >
              <BsEmojiNeutralFill />
            </button>
            <button
              className="py-4 text-2xl flex justify-center bg-green-500 bg-opacity-50 rounded m-2 disabled:opacity-50 disabled:outline"
              disabled={session?.rating === 2}
              onClick={() => rateTalk(2)}
            >
              <BsEmojiSmileFill />
            </button>
          </div>
          {!(session?.rating === undefined) && (
            <Button className="text-xs" onClick={() => setState("review")}>
              Review <FaArrowRight />
            </Button>
          )}
        </div>
      ) : state === "review" ? (
        <div className="bg-white rounded-sm text-sm bg-opacity-10 text-center my-2 pt-2 px-4">
          {session?.review ? (
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
              defaultValue={session?.review}
            />
            <Button type="submit" className="bg-momentum rounded">
              Submit
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
