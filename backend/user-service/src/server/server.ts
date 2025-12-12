import 'dotenv/config';
import { makeEnv } from '@/env/factories';
import { app } from './config';

const env = makeEnv();

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server Running on PORT: ${env.PORT}.`);
  });
