"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";

type Props = {
  children?: React.ReactNode;
  initialOpen?: boolean;
};

export default function SectionLayout({ children, initialOpen = true }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(initialOpen);
  const onToggleSidebar = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      <Sidebar isOpen={isOpen} onToggleSidebar={onToggleSidebar} />
      <div
        className={`transition-all duration-300 bg-slate-50 dark:bg-[#0a0a0a] ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}
