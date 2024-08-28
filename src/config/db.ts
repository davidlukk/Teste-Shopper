import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase', {
        });

        console.log('Conexão ao MongoDB bem sucedida');
    } catch (error) {
        console.error('Falha ao conectar ao MongoDB', error);
        process.exit(1);
    }
};

export default connectDB;