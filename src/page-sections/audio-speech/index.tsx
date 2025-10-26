"use client";
import SectionLayout from "@/components/SectionLayout";
import Sidebar from "@/components/Sidebar";
import React, { useCallback, useState } from 'react'

const AudioSpeechPage = () => {
    const [isOpen, setIsOpen] = useState(true);
    const onToggleSidebar = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return (
        <>
            <SectionLayout>
            {/* Audio & Speech content goes here */}
            </SectionLayout>
        </>
    )
}

export default AudioSpeechPage
