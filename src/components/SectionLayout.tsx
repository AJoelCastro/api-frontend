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
        className={`transition-all duration-300 bg-slate-50 dark:bg-red-500 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6 bg-white">{children}</div>
      </div>
    </>
  );
}
