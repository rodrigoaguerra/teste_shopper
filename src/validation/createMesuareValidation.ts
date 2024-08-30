import Joi from 'joi';

const createMeasureSchema = Joi.object({
  image: Joi.string().base64({ paddingRequired: true }).required(),
  customer_code: Joi.string().required(),
  measure_datetime: Joi.date().iso().required(),
  measure_type: Joi.string().valid('WATER', 'GAS').required()
});

export default createMeasureSchema;