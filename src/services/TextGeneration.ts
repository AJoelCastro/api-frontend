import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND

const TextGenerationService ={
    generateText: async (data: any) => {
        try {
            const response = await axios.post(`${API_URL}/openai/text-generation`,
                data 
            );
            return response.data;
        }catch (error) {
            console.error('Error generating text:', error);
            throw error;
        }
    }
}
export default TextGenerationService;