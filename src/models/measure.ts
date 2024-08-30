// src/models/measure.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IMeasure extends Document {
  measure_uuid: string;
  image_url: string;
  customer_code: string;
  measure_value: number;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
  has_confirmed: boolean;
}

const measureSchema: Schema = new Schema({
  measure_uuid: { type: String, required: true },
  image_url: { type: String, required: true },
  customer_code: { type: String, required: true },
  measure_value: { type: Number, required: true },
  measure_datetime: { type: Date, default: Date.now },
  measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
  has_confirmed: { type: Boolean, default: false }
});

const Measure = mongoose.model<IMeasure>('Measure', measureSchema);

export default Measure;
export { IMeasure };
