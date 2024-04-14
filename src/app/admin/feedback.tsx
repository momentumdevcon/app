// "use client";

// import { useQuery } from "@tanstack/react-query";
// import type { Session, Speaker } from "@/sessionize";
// import { json2csv } from "json-2-csv";

// export default function Feedback({
//   sessions,
//   speakers,
// }: {
//   sessions: Session[];
//   speakers: Speaker[];
// }) {
//   const { data: records } = useQuery(["reviews"], async () => {
//     const records = [] as any
//     return records;
//   });

//   const feedback = records
//     ?.filter((r) => r.event.type === "reviewed" || r.event.type === "rated")
//     .sort(
//       (a, b) =>
//         a.sessionId.localeCompare(b.sessionId) ||
//         a.event.type.localeCompare(b.event.type) ||
//         a.userId.localeCompare(b.userId),
//     );

//   function getSession(id: string) {
//     return sessions.find((s) => s.id === id);
//   }

//   return (
//     <>
//       <button
//         onClick={async () => {
//           if (!feedback) return;

//           const csv = await json2csv(
//             feedback
//               .map((record) => ({
//                 session: getSession(record.sessionId)?.title,
//                 speaker: speakers
//                   .filter(
//                     (speaker) =>
//                       getSession(record.sessionId)?.speakers.includes(
//                         speaker.id,
//                       ),
//                   )
//                   .map((s) => s.fullName)
//                   .join(", "),
//                 rating:
//                   record.event.type === "rated"
//                     ? record.event.reaction
//                     : record.event.type === "reviewed"
//                     ? record.event.review
//                     : "",
//                 userId: record.userId,
//               }))
//               .filter((r) => r.rating),
//           );
//           exportCSVFile(csv);
//         }}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Export CSV
//       </button>
//       <table className="table-fixed">
//         <thead>
//           <tr>
//             <th>Session</th>
//             <th>Speaker</th>
//             <th>Review</th>
//             <th>UserId</th>
//           </tr>
//         </thead>
//         <tbody>
//           {feedback?.map((record) => (
//             <FeedbackRow
//               key={record.id}
//               record={record}
//               speakers={speakers}
//               session={getSession(record.sessionId)}
//             />
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// }

// function exportCSVFile(csv: string) {
//   var exportedFilenmae = "export.csv";

//   var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   var link = document.createElement("a");
//   if (link.download !== undefined) {
//     // feature detection
//     // Browsers that support HTML5 download attribute
//     var url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", exportedFilenmae);
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// }

// function FeedbackRow({
//   record,
//   speakers,
//   session,
// }: {
//   record: AttendanceRecord;
//   speakers: Speaker[];
//   session?: Session;
// }) {
//   const toShow =
//     record.event.type === "rated"
//       ? record.event.reaction
//       : record.event.type === "reviewed"
//       ? record.event.review
//       : "";

//   if (!toShow) return <></>;

//   const speaker = speakers
//     .filter((speaker) => session?.speakers.includes(speaker.id))
//     .map((s) => s.fullName)
//     .join(", ");

//   return (
//     <tr key={record.id} className="border">
//       <td className="p-3">{session?.title}</td>
//       <td className="p-3">{speaker}</td>
//       <td className="">{toShow}</td>
//       <td className="">{record.userId}</td>
//     </tr>
//   );
// }
