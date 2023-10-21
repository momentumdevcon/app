import { getData } from "@/sessionize";
import Feedback from "./feedback";

export const metadata = {
  title: "Momentum | Stats Portal",
  description: "Momentum Developer Conference attendee stats!",
};

export default async function AdminPage() {
  const { sessions, speakers } = await getData();

  return (
    <main className="px-5">
      <h1 className="text-xl font-semibold my-4">Attendee Feedback</h1>
      <Feedback sessions={sessions} speakers={speakers} />
    </main>
  );
}
