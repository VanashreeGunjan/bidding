const dotenv = require('dotenv');
const path = require('path');

const result = dotenv.config({ path: path.resolve(__dirname, '.env') });

if (result.error) {
    throw result.error;
}

console.log('Environment variables loaded successfully');
