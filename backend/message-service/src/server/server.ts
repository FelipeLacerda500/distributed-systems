import 'dotenv/config';
import { envVarValidatorFactory } from '../env/factories';
import { app } from './config';

const envValidator = envVarValidatorFactory();

const { PORT } = envValidator.validate({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 3333,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
});

app
  .listen({
    host: '0.0.0.0',
    port: Number(PORT),
  })
  .then(() => {
    console.log(`HTTP Server Running on PORT: ${PORT}.`);
  });
