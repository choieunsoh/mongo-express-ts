Step-by-step guide to create a Node.js application using TypeScript, Jest, Prettier, ESLint, Express, MongoDB client, and pnpm as the package manager.

### Step 1: Setup pnpm

First, you need to have `pnpm` installed. If you don't have it yet, you can install it globally using npm:

```sh
npm install -g pnpm
```

### Step 2: Create a New Project

Create a new directory for your project and initialize a new pnpm project:

```sh
mkdir my-app
cd my-app
pnpm init
```

### Step 3: Install Dependencies

Install the necessary dependencies:

```sh
pnpm add express mongodb
pnpm add -D typescript ts-node @types/node @types/express jest ts-jest @types/jest prettier eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-node eslint-plugin-import

pnpm add supertest
pnpm add -D @types/supertest
```

### Step 4: Set Up TypeScript

Create a `tsconfig.json` file in the root of your project:

```bash
tsc --init
```

or

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Step 5: Set Up ESLint

Create a `.eslintrc.js` file:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {},
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
```

Create an `.eslintignore` file:

```plaintext
node_modules
dist
```

### Step 6: Set Up Prettier

Create a `.prettierrc` file:

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

Create a `.prettierignore` file:

```plaintext
node_modules
dist
```

### Step 7: Set Up Jest

Create a `jest.config.js` file:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
};
```

### Step 8: Create the App Structure

Create the following folder structure:

```
my-app
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── app.ts
│   └── index.ts
├── tests
│   └── example.test.ts
├── .eslintrc.js
├── .eslintignore
├── .prettierrc
├── .prettierignore
├── jest.config.js
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

### Step 9: Write the Code

#### `src/app.ts`

```typescript
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

export default app;
```

#### `src/index.ts`

```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

#### `src/routes/index.ts`

```typescript
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default router;
```

#### `tests/example.test.ts`

```typescript
import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });
});
```

### Step 10: Add Scripts to `package.json`

Update the `scripts` section in your `package.json`:

```json
"scripts": {
  "build": "tsc",
  "start": "ts-node src/index.ts",
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix",
  "format": "prettier --write \"src/**/*.ts\"",
  "test": "jest"
}
```

### Step 11: Run the Application

1. **Lint** your code:

   ```sh
   pnpm run lint
   ```

2. **Format** your code:

   ```sh
   pnpm run format
   ```

3. **Run** your tests:

   ```sh
   pnpm run test
   ```

4. **Start** the application:
   ```sh
   pnpm run start
   ```

You now have a fully set up Node.js application with TypeScript, Jest, Prettier, ESLint, Express, MongoDB client, and pnpm.
