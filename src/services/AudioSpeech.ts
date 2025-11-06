import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND

const AudioSpeechService = {
    convertTextToSpeech: async (input: string) => {
        try {
            // Backend expects an object with `input` (ASModel). Request audio as arraybuffer.
            const response = await axios.post(`${API_URL}/openai/audio-speech/text-to-audio`, { input }, { responseType: 'arraybuffer' });
            const contentType = response.headers['content-type'] || 'audio/mpeg';
            const audioBlob = new Blob([response.data], { type: contentType });
            return audioBlob;
        } catch (error) {
            console.error('Error converting text to speech:', error);
            throw error;
        }
    },
        transcribeAudio: async (file: File) => {
            try {
                const form = new FormData();
                form.append('file', file, file.name);
                // Backend endpoint for transcription - adjust if your backend path differs
                const response = await axios.post(`${API_URL}/openai/audio-speech/transcribe`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                // Expecting JSON { text: "..." } or similar
                return response.data;
            } catch (error) {
                console.error('Error transcribing audio:', error);
                throw error;
            }
        },

        // Helper to create a WebSocket connection to a realtime endpoint.
        // Returns a WebSocket instance; caller is responsible for attaching handlers.
        createRealtimeSocket: (path = '/openai/audio-speech/realtime') => {
            // Build ws/wss URL from API_URL
            try {
                const url = new URL(API_URL as string);
                const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = `${protocol}//${url.host}${path}`;
                return new WebSocket(wsUrl);
            } catch (error) {
                console.warn('Unable to create websocket URL from API_URL, fallback to relative path');
                return new WebSocket(path);
            }
        },
        createSession: async () => {
            try {
                const response = await axios.post(`${API_URL}/openai/audio-speech/session`);
                return response.data; // Expecting { client_secret: { value: "..." } }
            } catch (error) {
                console.error('Error creating session:', error);
                throw error;
            }
        }
};
export default AudioSpeechService;