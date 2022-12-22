import fs from 'fs';
import StreamZip from 'node-stream-zip';

import { TEST_ASSETS_DIRECTORY } from '../__test_assets__/testAssetsDirectory';
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
});
