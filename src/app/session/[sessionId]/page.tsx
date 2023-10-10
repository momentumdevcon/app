import { notFound } from "next/navigation";
import Image from "next/image";
import { FaMapMarkerAlt, FaClock, FaLevelUpAlt, FaTags } from "react-icons/fa";
import { getData } from "@/sessionize";
import { format } from "date-fns";
import clsx from "clsx";
import { Feedback } from "./feedback";

export default async function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const { sessions, rooms, speakers, categories } = await getData();
  const session = sessions.find((s) => s.id === params.sessionId);

  if (!session) notFound();
  const room = rooms.find((r) => r.id === session.roomId);

  const speaker = speakers.filter((speaker) =>
    session.speakers.includes(speaker.id),
  )[0];

  const categoryItems = categories.map((category) => ({
    title: category.title,
    item: category.items.filter((item) =>
      session.categoryItems.includes(item.id),
    ),
  }));

  return (
    <main className="px-5">
      <h1 className="text-xl font-semibold my-4">{session.title}</h1>
      {/* TODO: Only show this after the talk has ended */}
      <Feedback sessionId={session.id} />
      <div className="flex items-center gap-2">
        <FaMapMarkerAlt />
        <span className="">{room?.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <FaClock />
        <span className="">{format(new Date(session.startsAt), "h:mm a")}</span>
      </div>
      {categoryItems.map((category) => (
        <div className="flex items-center gap-2" key={category.title}>
          {category.title === `Level` ? <FaLevelUpAlt /> : <FaTags />}
          <div>
            {category.item.map((item) => (
              <span
                key={item.id}
                className={clsx(
                  `text-sm px-2 mr-1 rounded bg-opacity-70 text-white`,
                  category.title === "Level" && "bg-[#145bff]",
                  category.title === "Tags" && "bg-[#03969b]",
                )}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
      <p className="text-sm my-4">{session.description}</p>
      <div className="flex items-center gap-2 px-1 py-1">
        <Image
          src={speaker.profilePicture}
          alt={speaker.tagLine}
          className="rounded-full"
          width={64}
          height={64}
        />
        <div>
          <p className="">{speaker.fullName}</p>
          <p className="text-xs">{speaker.tagLine}</p>
        </div>
      </div>
    </main>
  );
}
