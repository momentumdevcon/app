import { getData, Session } from "@/sessionize";
import { TimeSlotComponent, ConsoleLog } from "./schedule";
import Image from "next/image";
import { Suspense } from "react";
import dayjs from "dayjs";
import clsx from "clsx";

export default function SchedulePage() {
  return (
    <main className="px-10">
      <h1 className="text-4xl font-semibold my-4">Schedule</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Schedule />
      </Suspense>
    </main>
  );
}

type TimeSlot = [string, string, Session[]];

async function Schedule() {
  const { rooms, speakers, sessions, categories } = await getData();

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
      <ConsoleLog {...{ rooms, speakers, sessions, categories }} />
      {timeSlots.map(([start, end, sessions], i) => (
        <TimeSlotComponent
          key={i}
          header={
            <h2>
              {dayjs(start).format("h:mm A")} to {dayjs(end).format("h:mm A")}
            </h2>
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
              <div className="">
                {categories.map((category) =>
                  category.items
                    .filter((item) => session.categoryItems.includes(item.id))
                    .map((item) => (
                      <span
                        key={item.id}
                        // className="text-xs bg-gray-700 px-1 py-1 rounded mr-2"
                        className={clsx(
                          "text-[11px] px-1 py-1 rounded mr-2 bg-opacity-70",
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
        />
      ))}
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
