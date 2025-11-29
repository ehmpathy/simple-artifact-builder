import { execSync } from 'child_process';
import fs from 'fs';
import StreamZip from 'node-stream-zip';
import os from 'os';
import path from 'path';

import { TEST_ASSETS_DIRECTORY } from '../.test/assets/testAssetsDirectory';
import { addFilesToArtifactContents } from '../contents/addFilesToArtifactContents';
import { clearArtifactDirectory } from '../contents/clearArtifactDirectory';
import { defineAllTracedFilesSpecified } from '../contents/defineAllTracedFilesSpecified';
import { zipArtifactContents } from './zipArtifactContents';

describe('zipArtifactContents', () => {
  it('should be able to zip artifact contents of built artifact', async () => {
    const projectRootDirectory = `${TEST_ASSETS_DIRECTORY}/nextjs-mui-project-next-dir-for-zipping`;
    const targetZipFilePath = `${projectRootDirectory}/.artifact/contents.zip`;

    // remove the previous file if it exists
    await fs.promises.unlink(targetZipFilePath).catch(() => {}); // do nothing on error, e.g., if file didn't already exist

    // zip the contents
    await zipArtifactContents({ projectRootDirectory });

    // check that the file was zipped
    await new Promise((resolve) => {
      const zip = new StreamZip({
        file: targetZipFilePath,
        storeEntries: true,
      });
      zip.on('ready', () => {
        expect(zip.entriesCount).toBeGreaterThan(10); // should have more than 10, sanity check
        expect(
          Object.fromEntries(
            Object.entries(zip.entries()).map(([name, value]) => [
              name,
              { ...value, time: '__REDACTED__', attr: '__REDACTED__' },
            ]),
          ),
        ).toMatchSnapshot();
        zip.close(); // close the file once done
        resolve(true); // and end the promise
      });
    });
  });

  it('should preserve pnpm symlinks in zip and work after extraction', async () => {
    const projectRootDirectory = `${TEST_ASSETS_DIRECTORY}/lambda-project-pnpm-deps`;
    const targetZipFilePath = `${projectRootDirectory}/.artifact/contents.zip`;

    // build the artifact contents with symlink preservation
    await clearArtifactDirectory({ projectRootDirectory });
    const tracedFiles = await defineAllTracedFilesSpecified({
      projectRootDirectory,
      traceFileGlobs: ['dist/handler.js'],
    });
    await addFilesToArtifactContents({
      projectRootDirectory,
      relativeFilePaths: tracedFiles,
    });

    // verify symlinks exist in artifact contents before zipping
    const mainPackageStat = await fs.promises.lstat(
      `${projectRootDirectory}/.artifact/contents/node_modules/main-package`,
    );
    expect(mainPackageStat.isSymbolicLink()).toBe(true);

    // zip the contents
    await zipArtifactContents({ projectRootDirectory });

    // extract to a temp directory and verify symlinks work
    const tempDir = path.join(os.tmpdir(), `pnpm-zip-test-${Date.now()}`);
    await fs.promises.mkdir(tempDir, { recursive: true });

    try {
      // extract the zip
      execSync(`unzip -q "${targetZipFilePath}" -d "${tempDir}"`);

      // verify symlink was preserved after extraction
      const extractedStat = await fs.promises.lstat(
        `${tempDir}/node_modules/main-package`,
      );
      expect(extractedStat.isSymbolicLink()).toBe(true);

      // verify the symlink target is correct
      const linkTarget = await fs.promises.readlink(
        `${tempDir}/node_modules/main-package`,
      );
      expect(linkTarget).toBe(
        '.pnpm/main-package@1.0.0/node_modules/main-package',
      );

      // verify Node.js resolution works through the symlink
      const result = execSync(
        `node -e "var m = require('./node_modules/main-package'); console.log(m.doSomething());"`,
        { cwd: tempDir, encoding: 'utf-8' },
      );
      expect(result.trim()).toBe('hello from nested-dep');
    } finally {
      // cleanup temp directory
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });
});
