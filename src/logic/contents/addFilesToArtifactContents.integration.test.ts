import fastGlob from 'fast-glob';
import fs from 'fs';

import { TEST_ASSETS_DIRECTORY } from '../.test/assets/testAssetsDirectory';
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

  it('should preserve symlinks when copying (pnpm compatibility)', async () => {
    const projectRootDirectory = `${TEST_ASSETS_DIRECTORY}/project-with-symlinks`;

    // make sure the artifact directory doesn't exist yet to run from a clean slate
    await clearArtifactDirectory({ projectRootDirectory });

    // verify the source is a symlink (simulating pnpm node_modules structure)
    const sourceStats = await fs.promises.lstat(
      `${projectRootDirectory}/node_modules/example-package`,
    );
    expect(sourceStats.isSymbolicLink()).toBe(true);

    // add both the symlink AND its target to the artifact (as pnpm tracing would)
    await addFilesToArtifactContents({
      projectRootDirectory,
      relativeFilePaths: [
        'src/app.ts',
        'node_modules/example-package', // symlink
        '.pnpm/example-package/package.json', // real file (symlink target)
        '.pnpm/example-package/src/index.js', // real file (symlink target)
      ],
    });

    // verify the symlink was preserved (not dereferenced)
    const destStats = await fs.promises.lstat(
      `${projectRootDirectory}/.artifact/contents/node_modules/example-package`,
    );
    expect(destStats.isSymbolicLink()).toBe(true);

    // verify the symlink target is correct
    const linkTarget = await fs.promises.readlink(
      `${projectRootDirectory}/.artifact/contents/node_modules/example-package`,
    );
    expect(linkTarget).toBe('../.pnpm/example-package');

    // verify the real files were copied (use dot: true to match .pnpm directory)
    const movedFiles = await fastGlob('.artifact/contents/**/*', {
      cwd: projectRootDirectory,
      dot: true,
    });
    expect(movedFiles).toContain('.artifact/contents/src/app.ts');
    expect(movedFiles).toContain(
      '.artifact/contents/.pnpm/example-package/package.json',
    );
    expect(movedFiles).toContain(
      '.artifact/contents/.pnpm/example-package/src/index.js',
    );

    // verify the symlink resolves correctly and we can read the file through it
    const copiedContent = await fs.promises.readFile(
      `${projectRootDirectory}/.artifact/contents/node_modules/example-package/src/index.js`,
      'utf-8',
    );
    expect(copiedContent).toContain("hello: () => 'world'");
  });
});
