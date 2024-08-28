import request from 'supertest';
import app from '../src/index';

describe('API de Medidas', () => {
  it('Deve enviar uma imagem e retornar uma leitura', async () => {
    const response = await request(app)
      .post('/api/measures/upload')
      .send({
        image_base64: 'data:image/png;base64,...',
        customer_code: '12345',
        measure_type: 'WATER',
        measure_datetime: new Date().toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data.measure_value');
  });
});
