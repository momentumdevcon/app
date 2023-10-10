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
  className,
}: {
  header: ReactNode;
  content: ReactNode;
  status?: "soon" | "started" | "ended";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className={className}>
        {open ? <FaChevronDown /> : <FaChevronRight />}
        {header}
      </CollapsibleTrigger>
      <CollapsibleContent>{content}</CollapsibleContent>
    </Collapsible>
  );
}
