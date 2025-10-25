import axios from "axios";

const API_URL = process.env.API_URL

const TextGenerationService ={
    generateText: async (prompt: string) => {
        try {
            const response = await axios.post(`${API_URL}/openai/text-generation`,
                { prompt }
            );
            return response.data;
        }catch (error) {
            console.error('Error generating text:', error);
            throw error;
        }
    }
}
export default TextGenerationService;