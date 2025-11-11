import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND

const ImagesVisionService = {
    generateImage: async (data:{ prompt: string; n: number; size: string;}) => {
        try {
            const response = await axios.post(`${API_URL}/openai/images-vision/generate-image`, data, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log("data:", data.prompt)
            return response.data; 
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    },
    analyzeImage: async (data:{ imageUrl: string; }) => {
        try {
            const response = await axios.post(`${API_URL}/openai/images-vision/analyze-image`, data,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log("data:", data.imageUrl)
            return response.data; 
        } catch (error) {
            console.error('Error analyzing image:', error);
            throw error;
        }
    }
}
export default ImagesVisionService;