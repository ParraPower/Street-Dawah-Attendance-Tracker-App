import fs from 'fs';
import path from 'path';

export type RouteMeta = {
  controller: string;
  method: string;
  path: string;
  handlerName?: string;
  options?: any;
  basePath?: string;
};

const ROUTES_FILE = path.resolve(process.cwd(), 'openapi.routes.json');

const controllerBasePaths: Record<string, string> = {};
const routes: RouteMeta[] = [];

function persist() {
  try { fs.writeFileSync(ROUTES_FILE, JSON.stringify({ routes, controllerBasePaths }, null, 2)); }
  catch (e) { console.error('Failed to write routes file', e); }
}

export const routeRegistry = {
  add(r: RouteMeta) {
    routes.push(r);
    persist();
  },
  setBasePath(controllerName: string, basePath: string) {
    controllerBasePaths[controllerName] = basePath;
    for (const rt of routes) if (rt.controller === controllerName) rt.basePath = basePath;
    persist();
  },
  list() { return { routes: [...routes], controllerBasePaths: { ...controllerBasePaths } }; }
};

export default routeRegistry;
