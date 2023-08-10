"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

export function TimeSlotComponent({
  content,
  header,
  status,
}: {
  header: ReactNode;
  content: ReactNode;
  status?: "soon" | "started" | "ended";
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={clsx(
          "py-2 px-4 bg-momentum w-full my-1 rounded-xl flex gap-2 items-center",
          status === "soon" && "bg-green-700",
          status === "started" && "bg-yellow-700",
          status === "ended" && "bg-gray-700"
        )}
      >
        {open ? <FaChevronDown /> : <FaChevronRight />}
        {header}{" "}
        <span className="text-sm opacity-80">
          {status === "soon"
            ? "(Starting soon)"
            : status === "started"
            ? "(In progress)"
            : status === "ended"
            ? "(Ended)"
            : null}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>{content}</CollapsibleContent>
    </Collapsible>
  );
}

export function ConsoleLog(props: any) {
  console.log(props);
  return null;
}
