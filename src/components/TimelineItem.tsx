import type { ReactNode } from "react";

interface TimelineItemProps {
  active?: boolean;
  children: ReactNode;
}

export default function TimelineItem({ active = false, children }: TimelineItemProps) {
  return (
    <div className={`timeline-dot ${active ? "timeline-dot-active" : ""}`}>
      {children}
    </div>
  );
}
