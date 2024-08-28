import { Request, Response } from 'express';
import Measure from '../models/measureModel';
import { getReadingFromImage } from '../services/googleGeminiService';

export const uploadImage = async (req: Request, res: Response) => {
    const { image_base64, customer_code, measure_type, measure_datetime } = req.body;

    if (!image_base64 || !customer_code || !measure_type || !measure_datetime) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Dados incompletos.' });
    }

    try {
        const measureValue = await getReadingFromImage(image_base64);

        const existingMeasure = await Measure.findOne({
            customer_code,
            measure_type,
            measure_datetime: { $gte: new Date(new Date(measure_datetime).setDate(1)), $lt: new Date(new Date(measure_datetime).setMonth(new Date(measure_datetime).getMonth() + 1)) }
        });

        if (existingMeasure) {
            return res.status(409).json({ error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada' });
        }

        const newMeasure = await Measure.create({
            customer_code,
            measure_type,
            measure_datetime,
            measure_value: measureValue,
            image_url: `https://fakeimg.com/${Date.now()}`, 
            confirmed: false
        });

        res.status(201).json({
            image_url: newMeasure.image_url,
            measure_value: newMeasure.measure_value,
            measure_uuid: newMeasure._id
        });
    } catch (error) {
        res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro ao processar a solicitação.' });
    }
};

export const confirmMeasure = async (req: Request, res: Response) => {
    const { measure_uuid, confirmed_value } = req.body;

    if (!measure_uuid || confirmed_value === undefined) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Dados incompletos.' });
    }

    try {
        const measure = await Measure.findById(measure_uuid);
        if (!measure) {
            return res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura não encontrada.' });
        }

        if (measure.confirmed) {
            return res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura já confirmada.' });
        }

        measure.measure_value = confirmed_value;
        measure.confirmed = true;
        await measure.save();

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro ao processar a solicitação.' });
    }
};

export const listMeasuresByCustomer = async (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    try {
        const filter: any = { customer_code };
        if (measure_type) {
            filter.measure_type = { $regex: new RegExp(`^${measure_type}$`, 'i') };         }

        const measures = await Measure.find(filter);

        if (measures.length === 0) {
            return res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada.' });
        }

        res.status(200).json({
            customer_code,
            measures: measures.map(measure => ({
                measure_uuid: measure._id,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.confirmed,
                image_url: measure.image_url
            }))
        });
    } catch (error) {
        res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro ao processar a solicitação.' });
    }
};
