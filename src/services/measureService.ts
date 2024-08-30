import { UpdateWriteOpResult } from 'mongoose';
import measureRepository from '../repositories/measureRepository';
import { IMeasure } from '../models/measure';
import { GoogleGenerativeAI } from "@google/generative-ai";
const fs = require('fs');

// Initialize GoogleGenerativeAI with your API_KEY.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: "gemini-1.5-flash",
});

class MeasureService {
  async createMeasure(measure: IMeasure): Promise<IMeasure | null> { 
    const existingMeasure = await measureRepository.findByUuid(measure.measure_uuid);
    if (existingMeasure) {
      throw new Error('Measure already exists');
    }
    return await measureRepository.create(measure);
  }

  // Verificar se já existe uma leitura para o tipo e mês especificados
  async existMeasure(measure_type: string, measure_datetime: Date): Promise<IMeasure | null> {
    // Converter timestamp para o início e fim do mês
    const date = new Date(measure_datetime);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    endOfMonth.setHours(0, 0, 0, 0);

    // Verificar se já existe uma leitura para o tipo e mês especificados
    return await measureRepository.findExistingMeasures(measure_type, startOfMonth, endOfMonth);
  }

  async readMeasureInGemini(image: string): Promise<number | null> {
    // Converts local file information to a GoogleGenerativeAI.Part object.
    function fileToGenerativePart(imageBase64: string, mimeType: string) {
        return {
        inlineData: {
            data: imageBase64,
            mimeType
        },
        };
    }

    const filePart1 = fileToGenerativePart(image, "image/jpeg");
    
    const prompt = "Provide the value in cubic meters of the meter, return only this numeric value";
    
    const generatedContent = await model.generateContent([prompt, filePart1]);
    
    return parseInt(generatedContent.response.text());
  }

  async measureFindByUuid(measure_uuid: string): Promise<IMeasure | null> {
    return await measureRepository.findByUuid(measure_uuid);
  }

  async confirmMeasure(measure_uuid: string, value: number): Promise<UpdateWriteOpResult> {
    return await measureRepository.confirmMeasure(measure_uuid, value);
  }

  async getMeasuresByCustomerCode(filter: any): Promise<IMeasure[]> {
    return await measureRepository.getMeasuresByCustomerCode(filter);      
  }
}

export default new MeasureService();
