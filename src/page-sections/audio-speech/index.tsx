"use client";
import SectionLayout from "@/components/SectionLayout";
import React, { useEffect, useRef, useState } from 'react'
import AudioSpeechService from '@/services/AudioSpeech'

type Mode = 'text-to-audio' | 'audio-to-audio';

const AudioSpeechPage: React.FC = () => {
    const [mode, setMode] = useState<Mode>('text-to-audio');

    // Text -> Audio state
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);



    // Realtime state
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [wsMessages, setWsMessages] = useState<string[]>([]);
    const [wsConnected, setWsConnected] = useState(false);

    useEffect(() => {
        return () => {
            // cleanup websocket and object URLs on unmount
            ws?.close();
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [ws, audioUrl]);

    // Handlers for Text->Audio
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
            setError(err?.message || 'Error calling audio service');
        } finally {
            setLoading(false);
        }
    };

    // (Audio->Text removed - not used)

    // Handlers for Realtime (Audio->Audio) - minimal WebSocket UI
    const connectRealtime = () => {
        if (wsConnected) return;
        const socket = AudioSpeechService.createRealtimeSocket();
        socket.onopen = () => {
            setWsMessages(prev => [...prev, '[connected]']);
            setWsConnected(true);
        };
        socket.onmessage = (ev) => {
            setWsMessages(prev => [...prev, `[recv] ${ev.data}`]);
        };
        socket.onclose = () => {
            setWsMessages(prev => [...prev, '[closed]']);
            setWsConnected(false);
            setWs(null);
        };
        socket.onerror = () => {
            setWsMessages(prev => [...prev, `[error]`]);
        };
        setWs(socket);
    };

    const disconnectRealtime = () => {
        ws?.close();
        setWs(null);
        setWsConnected(false);
    };

    const sendRealtimeMessage = (msg: string) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        ws.send(msg);
        setWsMessages(prev => [...prev, `[sent] ${msg}`]);
    };

    return (
        <SectionLayout>
            <div className="max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-semibold mb-4">Audio & Speech</h1>

                <div className="mb-4">
                    <div className="inline-flex rounded-md p-1">
                        <button
                            className={`px-4 py-2 rounded-md ${mode === 'text-to-audio' ? 'bg-black shadow' : 'text-gray-600'}`}
                            onClick={() => setMode('text-to-audio')}
                        >
                            Text → Audio
                        </button>
                        {/* Audio → Text removed */}
                        <button
                            className={`px-4 py-2 rounded-md ${mode === 'audio-to-audio' ? 'bg-black shadow' : 'text-gray-600'}`}
                            onClick={() => setMode('audio-to-audio')}
                        >
                            Audio → Audio (Realtime)
                        </button>
                    </div>
                </div>

                {mode === 'text-to-audio' && (
                    <section>
                        <form onSubmit={handleTTS} className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Text to convert to speech</label>
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
                                    {loading ? 'Generating...' : 'Generate Audio'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInput('');
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
                                <div className="mt-2 text-sm">
                                    <a className="text-indigo-600" href={audioUrl} download="tts-output.wav">Download audio</a>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                

                {mode === 'audio-to-audio' && (
                    <section>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">Realtime conversation is experimental. Connect to the backend realtime endpoint to exchange events (audio chunks / transcripts). Your backend must expose a websocket or realtime interface.</p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={connectRealtime}
                                    disabled={wsConnected}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-60"
                                >
                                    Connect
                                </button>
                                <button
                                    type="button"
                                    onClick={disconnectRealtime}
                                    disabled={!wsConnected}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-60"
                                >
                                    Disconnect
                                </button>
                                <button
                                    type="button"
                                    onClick={() => sendRealtimeMessage('ping')}
                                    disabled={!wsConnected}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60"
                                >
                                    Send Ping
                                </button>
                            </div>

                            <div className="mt-4 rounded shadow max-h-64 overflow-auto rounded-md border border-gray-200 p-3">
                                <h4 className="font-medium">Messages</h4>
                                <div className="text-xs text-gray-700 space-y-1 mt-2">
                                    {wsMessages.length === 0 ? <div className="text-gray-400">No messages yet</div> : wsMessages.map((m, i) => <div key={i}>{m}</div>)}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </SectionLayout>
    )
}

export default AudioSpeechPage
