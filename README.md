# Code-Era-TNF
Start up fastify app with typescript

## Tech Used

-   [Node JS @ 16.x](https://nodejs.org/en/)
-   [Mongo DB @ 4.4.x](https://www.mongodb.com/)
-   [NPM @ 8.5.x](https://www.npmjs.com/)
-   [Fastify @ 3.27.x](https://www.fastify.io/)

## Installation & Configuration

- clone the repository into your local machine after cloning the project do follow these steps

1. Install dependencies via npm:

```bash
npm i # (for local setup)
```

2. Create .env file identical to example.env with valid values
3. Make sure to set `SERVER_ENV` to `local` for local setup and change values accordingly in different environments.
4. To start the server

```bash
npm start
```

#### API Structure

```
Routes:
    ├── /
    ├── * (OPTIONS)
    └── home (GET)
```
