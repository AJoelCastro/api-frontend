import React, { useRef, useState } from "react";
import AudioSpeechService from "@/services/AudioSpeech";

interface TextToAudioProps {
  input: string;
  setInput: (val: string) => void;
}

const TextToAudio: React.FC<TextToAudioProps> = ({ input, setInput }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🗣️ Text → Audio
  const handleTTS = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setAudioUrl(null);
    try {
      const blob = await AudioSpeechService.convertTextToSpeech(input);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setTimeout(() => audioRef.current?.play(), 200);
    } catch (err: any) {
      setError(err?.message || "Error calling audio service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleTTS} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Text to convert to speech
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-200 p-3"
          placeholder="Type the text the backend should convert to audio"
        />

        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Audio"}
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setAudioUrl(null);
              setError(null);
            }}
            className="text-sm text-gray-600"
          >
            Reset
          </button>
        </div>
      </form>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {audioUrl && (
        <div className="mt-6 bg-white p-4 rounded-md shadow">
          <h2 className="font-medium mb-2">Result</h2>
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />
        </div>
      )}
    </section>
  );
};

export default TextToAudio;