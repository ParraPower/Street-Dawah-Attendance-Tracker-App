import { fileURLToPath } from "url";
import { dirname as pathDirname } from "path";

export function getDirname(metaUrl: string) {
  return pathDirname(fileURLToPath(metaUrl));
}
