import path from 'node:path';
import fs from 'node:fs';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export const swaggerConfig = {
  title: 'Attendance API',
  version: '1.0.0',
  description: 'OpenAPI documentation (generated)',
  servers: [{ url: process.env.BASE_URL || 'http://localhost:3000' }],
};

const SPEC_PATH = path.resolve(process.cwd(), 'openapi.json');

function ensureBearerSecurity(spec: Record<string, any>) {
  spec.components = {
    ...(spec.components ?? {}),
    securitySchemes: {
      ...(spec.components?.securitySchemes ?? {}),
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token issued by the authentication service',
      },
    },
  };

  return spec;
}

export function loadSpec() {
  if (fs.existsSync(SPEC_PATH)) {
    try {
      const raw = fs.readFileSync(SPEC_PATH, 'utf8');
      return ensureBearerSecurity(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to parse openapi.json:', e);
    }
  }

  return ensureBearerSecurity({
    openapi: '3.0.0',
    info: { title: swaggerConfig.title, version: swaggerConfig.version, description: swaggerConfig.description },
    servers: swaggerConfig.servers,
    paths: {},
    components: {},
  });
}

export function initSwagger(app: Express, options?: { docsPath?: string; specPath?: string }) {
  const spec = loadSpec();
  const specPath = options?.specPath ?? '/openapi.json';
  const docsPath = options?.docsPath ?? '/api/docs';
  app.get(specPath, (_req, res) => res.json(spec));
  app.use(
    docsPath,
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );
}

export default initSwagger;
