import fastGlob from 'fast-glob';
import fs from 'fs';

import { TEST_ASSETS_DIRECTORY } from '../__test_assets__/testAssetsDirectory';
import { addFilesToArtifactContents } from './addFilesToArtifactContents';
import { clearArtifactDirectory } from './clearArtifactDirectory';

describe('addFilesToArtifactContents', () => {
  it('should be able to add nested files into an artifact directory that doesnt even exist yet', async () => {
    const projectRootDirectory = `${TEST_ASSETS_DIRECTORY}/project-with-files-to-test-adding-to-artifact`;

    // make sure the artifact directory doesn't exist yet to run from a clean slate
    await clearArtifactDirectory({ projectRootDirectory });

    // add files to the artifact directory
    await addFilesToArtifactContents({
      projectRootDirectory,
      relativeFilePaths: [
        'src/thingA.ts',
        'mode_nodules/simple-thing-doer/src/index.js',
      ],
    });

    // now check that we moved them successfully, and only them
    const movedFiles = await fastGlob('.artifact/contents/**/*', {
      cwd: projectRootDirectory,
    });
    expect(movedFiles).toContain('.artifact/contents/src/thingA.ts');
    expect(movedFiles).toContain(
      '.artifact/contents/mode_nodules/simple-thing-doer/src/index.js',
    );
    expect(movedFiles).not.toContain('.artifact/contents/dist/logic/thingB.js');
  });

  it('should dereference symlinks when copying (pnpm compatibility)', async () => {
    const projectRootDirectory = `${TEST_ASSETS_DIRECTORY}/project-with-symlinks`;

    // make sure the artifact directory doesn't exist yet to run from a clean slate
    await clearArtifactDirectory({ projectRootDirectory });

    // verify the source is a symlink (simulating pnpm node_modules structure)
    const sourceStats = await fs.promises.lstat(
      `${projectRootDirectory}/node_modules/example-package`,
    );
    expect(sourceStats.isSymbolicLink()).toBe(true);

    // add the symlinked directory to the artifact
    await addFilesToArtifactContents({
      projectRootDirectory,
      relativeFilePaths: [
        'src/app.ts',
        'node_modules/example-package', // this is a symlink
      ],
    });

    // verify the files were copied successfully
    const movedFiles = await fastGlob('.artifact/contents/**/*', {
      cwd: projectRootDirectory,
    });
    expect(movedFiles).toContain('.artifact/contents/src/app.ts');
    expect(movedFiles).toContain(
      '.artifact/contents/node_modules/example-package/package.json',
    );
    expect(movedFiles).toContain(
      '.artifact/contents/node_modules/example-package/src/index.js',
    );

    // verify the copied result is a real directory, not a symlink
    const destStats = await fs.promises.lstat(
      `${projectRootDirectory}/.artifact/contents/node_modules/example-package`,
    );
    expect(destStats.isSymbolicLink()).toBe(false);
    expect(destStats.isDirectory()).toBe(true);

    // verify the file contents were copied correctly
    const copiedContent = await fs.promises.readFile(
      `${projectRootDirectory}/.artifact/contents/node_modules/example-package/src/index.js`,
      'utf-8',
    );
    expect(copiedContent).toContain("hello: () => 'world'");
  });
});
