import mongoose, { Document } from 'mongoose';

export interface IMeasure extends Document {
    customer_code: string;
    measure_type: string;
    measure_datetime: Date;
    measure_value: number;
    confirmed: boolean;
    image_url: string;
}

const measureSchema = new mongoose.Schema<IMeasure>({
    customer_code: { type: String, required: true },
    measure_type: { type: String, required: true },
    measure_datetime: { type: Date, required: true },
    measure_value: { type: Number, required: true },
    confirmed: { type: Boolean, default: false },
    image_url: { type: String, required: true },
});

export default mongoose.model<IMeasure>('Measure', measureSchema);