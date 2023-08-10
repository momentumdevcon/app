"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ReactNode, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

export function TimeSlotComponent({
  content,
  header,
}: {
  header: ReactNode;
  content: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="py-2 px-4 bg-momentum w-full my-1 rounded-xl flex gap-2 items-center">
        {open ? <FaChevronDown /> : <FaChevronRight />}
        {header}
      </CollapsibleTrigger>
      <CollapsibleContent>{content}</CollapsibleContent>
    </Collapsible>
  );
}

export function ConsoleLog(props: any) {
  console.log(props);
  return null;
}
