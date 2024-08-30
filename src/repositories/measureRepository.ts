
import { UpdateWriteOpResult } from 'mongoose';
import Measure, { IMeasure } from '../models/measure'; 

class MeasureRepository {
  async create(measure: IMeasure) {
    return await measure.save();
  }

  async findByUuid(measure_uuid: string) {
    return await Measure.findOne({ measure_uuid });
  }

  async findExistingMeasures(measure_type: string, startOfMonth: Date, endOfMonth: Date) {
    return await Measure.findOne({
      measure_type,
      measure_datetime: { $gte: startOfMonth, $lte: endOfMonth }
    });
  }

  async confirmMeasure(measure_uuid: string, measure_value: number): Promise<UpdateWriteOpResult> {
    return await Measure.updateOne({ measure_uuid }, { measure_value, has_confirmed: true }).exec();
  }

  async getMeasuresByCustomerCode(filter: any): Promise<IMeasure[]> {
    return await Measure.find(filter);
  } 
}

export default new MeasureRepository();