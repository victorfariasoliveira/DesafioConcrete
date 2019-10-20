import app from './app';

require('./bootstrap');

app.listen(process.env.APP_PORT);
