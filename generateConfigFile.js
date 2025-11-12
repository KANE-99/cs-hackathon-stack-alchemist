const fs = require('fs');

const configName = process.env.NODE_ENV || 'development';
console.log('Generating config.js file...', configName);

const sourceData = require(`../../config/env/${configName}`);
const relatedConfig = sourceData.resources.csr || {}

// Generate the config.ts content
const configContent = `
// Auto-generated config.ts file
export default ${JSON.stringify(relatedConfig, null, 2)};
`;

// Write the config.ts file
const configFilePath = './src/config.ts';
fs.writeFileSync(configFilePath, configContent, 'utf8');

console.log('config.js file generated successfully!');

// Generate the .env content
const targetAppUrl = new URL(relatedConfig.TARGET_APP_URL);
// Write the .env file
const envFilePath = '.env';
fs.writeFileSync(envFilePath, `PORT=${targetAppUrl.port}`, 'utf8');

console.log('.env file generated successfully!');
