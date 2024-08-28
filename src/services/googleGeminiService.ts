import axios from 'axios';

const GOOGLE_GEMINI_API_URL = process.env.GOOGLE_GEMINI_API_URL || 'https://api.google.com/gemini';
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';

export const getReadingFromImage = async (imageBase64: string): Promise<number> => {
    try {
        const response = await axios.post(GOOGLE_GEMINI_API_URL, {
            image: imageBase64,
            apiKey: GOOGLE_GEMINI_API_KEY,
        });

        return response.data.reading;
    } catch (error) {
        console.error('Erro ao consultar a API do Google Gemini', error);
        throw new Error('Erro ao obter leitura da imagem.');
    }
};
