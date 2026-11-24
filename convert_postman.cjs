
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const source = path.join(
  __dirname,
  'postman',
  'collections',
  'Inventory Management System API'
);

const output = path.join(
  __dirname,
  'Inventory_Management_API.postman_collection.json'
);

function sanitize(value) {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value && typeof value === 'object') {
    const result = {};

    for (const [key, item] of Object.entries(value)) {
      const normalized = key.toLowerCase().replace(/_/g, '');

      if (normalized === 'password') {
        result[key] = '{{password}}';
      } else if (normalized === 'email') {
        result[key] = '{{email}}';
      } else if (
        ['token', 'accesstoken', 'jwt', 'secret'].includes(normalized)
      ) {
        result[key] = '{{access_token}}';
      } else {
        result[key] = sanitize(item);
      }
    }

    return result;
  }

  return value;
}

const files = fs.readdirSync(source)
  .filter(name => name.endsWith('.request.yaml'))
  .sort();

const items = [];

for (const filename of files) {
  const filepath = path.join(source, filename);
  const data = YAML.parse(fs.readFileSync(filepath, 'utf8'));

  const method = String(data.method || 'GET').toUpperCase();
  const url = new URL(data.url);
  const endpoint = url.pathname + url.search;

  const isPublic = [
    '/auth/login',
    '/auth/register'
  ].includes(url.pathname);

  const request = {
    method,
    header: [],
    auth: isPublic
      ? { type: 'noauth' }
      : {
          type: 'bearer',
          bearer: [{
            key: 'token',
            value: '{{access_token}}',
            type: 'string'
          }]
        },
    url: '{{base_url}}' + endpoint
  };

  if (method !== 'GET' && method !== 'DELETE') {
    const raw = data.body?.content;

    if (raw && String(raw).trim()) {
      try {
        const parsed = JSON.parse(raw);

        request.body = {
          mode: 'raw',
          raw: JSON.stringify(sanitize(parsed), null, 2),
          options: {
            raw: { language: 'json' }
          }
        };

        request.header.push({
          key: 'Content-Type',
          value: 'application/json'
        });
      } catch {
        console.warn('Skipped invalid JSON body:', filename);
      }
    }
  }

  items.push({
    name: method + ' ' + endpoint,
    request
  });
}

function authRequest(name, endpoint, body) {
  return {
    name,
    request: {
      method: 'POST',
      auth: { type: 'noauth' },
      header: [{
        key: 'Content-Type',
        value: 'application/json'
      }],
      url: '{{base_url}}' + endpoint,
      body: {
        mode: 'raw',
        raw: JSON.stringify(body, null, 2),
        options: {
          raw: { language: 'json' }
        }
      }
    }
  };
}

items.unshift(
  authRequest('Register User', '/auth/register', {
    fullName: 'Test User',
    email: '{{email}}',
    password: '{{password}}'
  })
);

items.unshift(
  authRequest('Login User', '/auth/login', {
    email: '{{email}}',
    password: '{{password}}'
  })
);

const collection = {
  info: {
    name: 'Inventory Management System API',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    description: 'NestJS inventory management API'
  },
  variable: [
    { key: 'base_url', value: 'http://localhost:3000' },
    { key: 'access_token', value: '' },
    { key: 'email', value: '' },
    { key: 'password', value: '' }
  ],
  item: items
};

fs.writeFileSync(
  output,
  JSON.stringify(collection, null, 2),
  'utf8'
);

console.log('Conversion completed!');
console.log('YAML requests converted:', files.length);
console.log('JSON requests generated:', items.length);
console.log('Output:', output);
