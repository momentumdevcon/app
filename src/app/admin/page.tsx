import { getData } from "@/sessionize";
import Feedback from "./feedback";
import { OrganizationSwitcher, auth } from "@clerk/nextjs";

export const metadata = {
  title: "Momentum | Stats Portal",
  description: "Momentum Developer Conference attendee stats!",
};

export default async function AdminPage() {
  const { orgSlug } = auth();
  const { sessions, speakers } = await getData();

  return (
    <main className="px-5">
      <div className="flex">
        <h1 className="text-xl font-semibold my-4 grow">Attendee Feedback</h1>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "text-white",
            },
          }}
        />
      </div>
      {orgSlug === "momentum" ? (
        <Feedback sessions={sessions} speakers={speakers} />
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-semibold my-4">Access Denied</h1>
          <p className="text-lg">
            You must be a Momentum admin to view this page.
          </p>
        </div>
      )}
    </main>
  );
}
