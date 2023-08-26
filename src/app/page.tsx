import { getData, Session } from "@/sessionize";
import { TimeSlotComponent, ConsoleLog } from "./schedule";
import Image from "next/image";
import { Suspense } from "react";
import { differenceInMinutes, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import clsx from "clsx";

export const revalidate = 60;

export default function SchedulePage() {
  return (
    <main className="px-5">
      <h1 className="text-4xl font-semibold my-4">Schedule</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Schedule />
      </Suspense>
    </main>
  );
}

function isStartingSoonOrStarted(startsAt: string, endsAt: string) {
  const now = utcToZonedTime(
    new Date(),
    // new Date("Oct 19 2023 2023 08:51:13 GMT-0400"), // for testing
    "America/New_York"
  );

  const startDiff = differenceInMinutes(new Date(startsAt), now, {
    roundingMethod: "floor",
  });
  const endDiff = differenceInMinutes(new Date(endsAt), now, {
    roundingMethod: "floor",
  });

  if (endDiff < 0) return "ended";
  if (startDiff < 20 && startDiff >= 0) return "soon";
  if (endDiff < 50) return "started";
}

type TimeSlot = [string, string, Session[]];

async function Schedule() {
  const { rooms, sessions, categories } = await getData();

  const timeSlots = sessions.reduce<TimeSlot[]>((acc, session) => {
    const slot = acc.find(
      ([start, end]) => start === session.startsAt && end === session.endsAt
    );

    if (slot) {
      slot[2].push(session);
    } else {
      acc.push([session.startsAt, session.endsAt, [session]]);
    }

    return acc;
  }, []);

  return (
    <>
      {/* <ConsoleLog {...{ rooms, sessions, categories }} /> */}
      {timeSlots.map(([start, end, sessions], i) => {
        const status = isStartingSoonOrStarted(start, end);
        return (
          <>
            {sessions.length > 1 ? (
              <TimeSlotComponent
                key={i}
                header={
                  <>
                    <h2>
                      {
                        // dayjs(start).format("h:mm A")
                        format(new Date(start), "h:mm a")
                      }{" "}
                      to {/* {dayjs(end).format("h:mm A")} */}
                      {format(new Date(end), "h:mm a")}
                    </h2>{" "}
                    <span className="text-sm opacity-80">
                      {status === "soon"
                        ? "(Starting soon)"
                        : status === "started"
                        ? "(In progress)"
                        : status === "ended"
                        ? "(Ended)"
                        : null}
                    </span>
                  </>
                }
                content={sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-xl p-3 my-2 border-gray-700 flex flex-col gap-2"
                  >
                    <h3 className="text-sm">{session.title}</h3>
                    <p className="text-xs opacity-90">
                      {rooms.find((room) => room.id === session.roomId)?.name}
                    </p>
                    {session.speakers.map((speakerId) => (
                      <SpeakerComponent key={speakerId} id={speakerId} />
                    ))}
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) =>
                        category.items
                          .filter((item) =>
                            session.categoryItems.includes(item.id)
                          )
                          .map((item) => (
                            <span
                              key={item.id}
                              className={clsx(
                                "text-[11px] text-white px-1 py-1 rounded bg-opacity-70",
                                category.title === "Level" && "bg-[#145bff]",
                                category.title === "Tags" && "bg-[#03969b]"
                              )}
                            >
                              {item.name}
                            </span>
                          ))
                      )}
                    </div>
                  </div>
                ))}
                status={status}
                className={clsx(
                  "py-2 px-4 bg-momentum w-full my-1 rounded-xl flex gap-2 items-center",
                  status === "soon" && "bg-green-700",
                  status === "started" && "bg-yellow-700",
                  status === "ended" && "bg-gray-700"
                )}
              />
            ) : (
              <>
                <div className="px-3 py-3 border-gray-700 flex flex-col gap-1">
                  <h2 className="text-sm">
                    {/* {dayjs(start).format("h:mm A")} to{" "}
                    {dayjs(end).format("h:mm A")} */}
                    {format(new Date(start), "h:mm a")}
                    {" to "}
                    {format(new Date(end), "h:mm a")}
                  </h2>
                  <h3 className="text-sm">
                    {sessions[0].title} -{" "}
                    {rooms.find((room) => room.id === sessions[0].roomId)?.name}
                  </h3>
                </div>
              </>
            )}
          </>
        );
      })}
    </>
  );
}

async function SpeakerComponent({ id }: { id: string }) {
  const { speakers } = await getData();

  const speaker = speakers.find((speaker) => speaker.id === id);

  if (!speaker) {
    return null;
  }

  return (
    <p className="text-xs flex items-center gap-2 px-1 py-1">
      <Image
        src={speaker.profilePicture}
        alt={speaker.fullName}
        className="rounded-full"
        width={24}
        height={24}
      />
      {speaker.fullName}
    </p>
  );
}
