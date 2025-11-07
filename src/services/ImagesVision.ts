import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND

const ImagesVisionService = {
    generateImage: async (data:any) => {
        try {
            const response = await axios.post(`${API_URL}/openai/images-vision/generate-image`, 
                data,
                {}
            );
            return response.data; 
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    }
}
export default ImagesVisionService;