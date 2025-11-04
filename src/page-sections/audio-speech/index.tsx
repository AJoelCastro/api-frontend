"use client";
import SectionLayout from "@/components/SectionLayout";
import React, { useRef, useState } from "react";
import TextToAudio from "./TextToAudio";
import AudioToAudio from "./AudioToAudio";

type Mode = "text-to-audio" | "audio-to-audio";

const AudioSpeechPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>("text-to-audio");

  // Text -> Audio
  const [input, setInput] = useState("");

  return (
    <SectionLayout>
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Audio & Speech</h1>

        {/* Mode selector */}
        <div className="mb-4">
          <div className="inline-flex rounded-md p-1">
            <button
              className={`px-4 py-2 rounded-md ${
                mode === "text-to-audio" ? "bg-black text-white" : "text-gray-600"
              }`}
              onClick={() => setMode("text-to-audio")}
            >
              Text → Audio
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                mode === "audio-to-audio" ? "bg-black text-white" : "text-gray-600"
              }`}
              onClick={() => setMode("audio-to-audio")}
            >
              Audio → Audio (Realtime)
            </button>
          </div>
        </div>

        {/* TEXT TO AUDIO */}
        {mode === "text-to-audio" && (
          <TextToAudio input={input} setInput={setInput} />
        )}

        {/* AUDIO TO AUDIO */}
        {mode === "audio-to-audio" && <AudioToAudio />}
      </div>
    </SectionLayout>
  );
};

export default AudioSpeechPage;
