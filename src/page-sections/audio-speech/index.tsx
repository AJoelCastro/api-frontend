"use client";
import SectionLayout from "@/components/SectionLayout";
import React, { useEffect, useRef, useState } from "react";
import AudioSpeechService from "@/services/AudioSpeech";

type Mode = "text-to-audio" | "audio-to-audio";

const AudioSpeechPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>("text-to-audio");

  // Text -> Audio
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Realtime Audio
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle");
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const analyserLocalRef = useRef<AnalyserNode | null>(null);
  const analyserRemoteRef = useRef<AnalyserNode | null>(null);

  const startCall = async () => {
    try {
        setStatus("connecting");

        const response = await fetch("/api/session", { method: "POST" });
        const data = await response.json();

        const pc = new RTCPeerConnection();

        // 🔈 Reproducir el audio remoto
        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        pc.ontrack = (e) => {
            audioEl.srcObject = e.streams[0];
            monitorRemoteAudio(e.streams[0]);
        };

        // 🎙️ Capturar micrófono local
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
        monitorLocalAudio(localStream);

        // 🧠 Establecer conexión
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // 🔄 Aquí está la corrección clave:
        const r = await fetch(
            "https://api.openai.com/v1/realtime?model=gpt-realtime",
            {
                method: "POST",
                body: offer.sdp,
                headers: {
                Authorization: `Bearer ${data.client_secret.value}`,
                "Content-Type": "application/sdp",
                },
            }
        );

        const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await r.text(),
        };

        await pc.setRemoteDescription(answer);
        setConnected(true);
        setStatus("connected");
        pcRef.current = pc;
    } catch (err) {
        console.error("Error starting call:", err);
        setStatus("idle");
    }
    };


  const stopCall = () => {
    pcRef.current?.close();
    pcRef.current = null;
    setConnected(false);
    setStatus("idle");
    setUserSpeaking(false);
    setAiSpeaking(false);
  };

  // 🎚️ Analizar el nivel de audio del micrófono
  const monitorLocalAudio = (stream: MediaStream) => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 512;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setUserSpeaking(avg > 20); // umbral simple
      requestAnimationFrame(loop);
    };
    loop();
    analyserLocalRef.current = analyser;
  };

  // 🎧 Analizar nivel de audio remoto (IA)
  const monitorRemoteAudio = (stream: MediaStream) => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 512;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setAiSpeaking(avg > 20); // umbral simple
      requestAnimationFrame(loop);
    };
    loop();
    analyserRemoteRef.current = analyser;
  };

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
        )}

        {/* AUDIO TO AUDIO */}
        {mode === "audio-to-audio" && (
          <section>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Realtime conversation lets you talk directly with the AI using your mic.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={startCall}
                  disabled={status === "connecting" || connected}
                  className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-60"
                >
                  {status === "connecting" ? "Connecting..." : "Connect"}
                </button>
                <button
                  onClick={stopCall}
                  disabled={!connected}
                  className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-60"
                >
                  Disconnect
                </button>
              </div>

              {/* 🔵 Indicadores visuales */}
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full transition-all ${
                      userSpeaking ? "bg-green-500 scale-125" : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-sm">Tú hablando</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full transition-all ${
                      aiSpeaking ? "bg-blue-500 scale-125" : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-sm">IA hablando</span>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span
                    className={`text-xs font-medium ${
                      status === "connected"
                        ? "text-green-600"
                        : status === "connecting"
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    {status === "connected"
                      ? "Conectado"
                      : status === "connecting"
                      ? "Conectando..."
                      : "Desconectado"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </SectionLayout>
  );
};

export default AudioSpeechPage;
