require('./bootstrap')
import app from './app';

app.listen(process.env.APP_URL);
