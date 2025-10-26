import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND

const StructuredOutputService ={
    generateStructuredOutput: async (prompt: string) => {
        try {
            const response = await axios.post(`${API_URL}/openai/structured-output`,
                { prompt }
            );
            return response.data;
        }catch (error) {
            console.error('Error generating structured output:', error);
            throw error;
        }
    }
}

export default StructuredOutputService;