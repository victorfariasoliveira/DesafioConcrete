import app from './app';

require('./bootstrap');

app.listen(process.env.PORT || 3333);
