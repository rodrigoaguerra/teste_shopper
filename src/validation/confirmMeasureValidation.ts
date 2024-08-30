import Joi from 'joi';

const confirmMeasureSchema = Joi.object({
  measure_uuid: Joi.string().required(),
  confirmed_value: Joi.number().integer().required(),
});

export default confirmMeasureSchema;