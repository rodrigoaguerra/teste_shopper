// src/controllers/measureController.ts
import { Request, Response } from 'express';
import Measure, { IMeasure } from '../models/measure';
import createMeasureSchema from '../validation/createMesuareValidation';
import confirmMeasureSchema from '../validation/confirmMeasureValidation';
import measureService from '../services/measureService';
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
  * Responsável por receber uma imagem em base 64, consultar o Gemini 
  * e retornar a medida lida pela API
  * @param req => {
  *   image: "base64"
  *   customer_code: "string"
  *   measure_datetime: "datetime"
  *   measure_type: "WATER" ou "GAS"
  * }
  * @param res => { 
  *   link: Um link temporário para a imagem
  *   guid: Identificador único globalmente
  *   medida: O valor numérico reconhecido pela LLM
  * }
  * @returns 
 */
export const createMeasure = async (req: Request, res: Response): Promise<Response> => {
  // Validar o tipo de dados dos parâmetros enviados (inclusive o base64)
  const { error } = createMeasureSchema.validate(req.body);

  if(error) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: error.details[0].message
    });
  }

  const { image, customer_code, measure_datetime, measure_type } = req.body;
  
  // Verificar se já existe uma leitura para o tipo e mês especificados
  const existingMeasure = await measureService.existMeasure(measure_type, measure_datetime);
  
  if (existingMeasure) {
    return res.status(409).json({
      error_code: "DOUBLE_REPORT",
      error_description: "Leitura do mês já realizada"
    });
  }

  // Gerar um identificador unico
  const id = uuidv4(); 

  // Integrar com uma API de LLM para extrair o valor da imagem
  const measure_value = await measureService.readMeasureInGemini(image);
  
  // Salvar imagem temporaria no server

  // Converta a string Base64 em um buffer
  const buffer = Buffer.from(image, 'base64');

  const filePath = `public/${id}.png`;

  // Escreva o buffer em um arquivo
  fs.writeFile(filePath, buffer, (err: string) => {
    if (err) {
      console.error('Erro ao salvar a imagem:', err);
    }
  });

  const PORT = process.env.PORT || 3000;

  try {
    
    const measure = new Measure({
      measure_uuid: id,
      image_url: `http://localhost:${PORT}/${id}.png`,
      customer_code,
      measure_value,
      measure_datetime,
      measure_type,
      has_confirmed: false
    });
    
    await measureService.createMeasure(measure);

    return res.status(200).json({
      image_url: `http://localhost:${PORT}/${id}.png`,
      measure_value,
      measure_uuid: id
    });
  } catch (error) {
    return res.status(400).json({
      error_code: "DATABASE_CONNECTION_ERROR",
      error_description: error
    });
  }
};

/**
  * Responsável por confirmar ou corrigir o valor lido pelo LLM
  * @param req => {
  *   measure_uuid: "string",
  *   confirmed_value: integer
  * }
  * @param res => {
  *   success: true
  * }
  * @returns 
  */
export const confirmMeasure = async (req: Request, res: Response): Promise<Response> => {
  // Validar o tipo de dados dos parâmetros enviados
  const { error } = confirmMeasureSchema.validate(req.body);

  if(error) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: error.details[0].message
    });
  }

  const { measure_uuid, confirmed_value } = req.body;
  // Verificar se o código de leitura informado existe
  const measure: IMeasure | null = await measureService.measureFindByUuid(measure_uuid);
  
  if(!measure) {
    return res.status(404).json({
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Leitura não encontrada"
    });
  }

  // Verificar se o código de leitura já foi confirmado
  if(measure.has_confirmed) {
    return res.status(409).json({
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura do mês já realizada"
    });
  }

  // Salvar no banco de dados o novo valor informado
  await measureService.confirmMeasure(measure_uuid, confirmed_value);

  return res.status(200).json({ success: true });
}

/**
 * 
 * @param req => {
 *   customer_code: "string"
 *   measure_type: "WATER" | "GAS"
 * }
 * @param res =>:{
 *   customer_code: string
 *   measures: IMeasure[] 
 * }
 */
export const getMeasuresByCustomerCode = async (req: Request, res: Response): Promise<Response> => {
  const { customer_code } = req.params; // Obtém o código do cliente
  const { measure_type } = req.query;  // Obtém o tipo de medida

  try {
    // Cria o filtro base
    const filter: any = { customer_code };

    // Adiciona o filtro para measure_type se fornecido
    if (measure_type) {
      const measureType = (measure_type as string).toUpperCase(); // Converte para maiúsculas
      
      if (measureType !== 'WATER' && measureType !== 'GAS') {
        return res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida" 
        });
      }
      
      filter.measure_type = measureType;
    }

    // Consulta no banco de dados
    const measures = await measureService.getMeasuresByCustomerCode(filter);
    
    // Nenhum registro encontrado
    if (!measures?.length || measures.length === 0) {
      return res.status(400).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada" 
      });
    }

    // Envia a resposta
    return res.json({
      customer_code,
      measures
    });
  } catch (error) {
    console.error('Error fetching measures:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}