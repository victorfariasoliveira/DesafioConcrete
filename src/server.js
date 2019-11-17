import dotenv from 'dotenv';
import app from './app';

dotenv.config({
  path: process.env.NODE_ENV === 'testes' ? '.env.test' : '.env',
});
app.listen(3334);
