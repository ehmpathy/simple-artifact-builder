import { promises as fs } from 'fs';

export const removeDirectoryAsync = ({ directory }: { directory: string }) =>
  fs.rm(directory, { recursive: true, force: true });
