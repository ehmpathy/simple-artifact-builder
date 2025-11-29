import { TEST_ASSETS_DIRECTORY } from '../.test/assets/testAssetsDirectory';
import { UserInputError } from '../UserInputError';
import { defineAllTracedFilesSpecified } from './defineAllTracedFilesSpecified';

describe('defineALlTracedFilesSpecified', () => {
  it('should throw a helpful error message if it finds that the user requested tracing of a file that is not supported', async () => {
    try {
      await defineAllTracedFilesSpecified({
        projectRootDirectory: `${TEST_ASSETS_DIRECTORY}/lambda-project-simple-deps`,
        traceFileGlobs: ['dist/**/*'],
      });
      throw new Error('should not reach here');
    } catch (error) {
      expect(error).toBeInstanceOf(UserInputError);
      expect((error as UserInputError).message).toMatchSnapshot(); // it should look good
    }
  });
  it('should correctly trace files + dependencies of files that we have to run tracing on ourselves', async () => {
    const filePaths = await defineAllTracedFilesSpecified({
      projectRootDirectory: `${TEST_ASSETS_DIRECTORY}/lambda-project-simple-deps`,
      traceFileGlobs: ['dist/handler.js'],
    });
    expect(filePaths.length).toBeGreaterThan(1);
    expect(filePaths).toContain('dist/handler.js');
    expect(filePaths).toContain('dist/server.js');
    expect(filePaths).toContain('package.json');
  });
  it('should correctly trace dependencies of files that were specified by existing nft.json trace output files', async () => {
    const filePaths = await defineAllTracedFilesSpecified({
      projectRootDirectory: `${TEST_ASSETS_DIRECTORY}/nextjs-mui-project-next-dir-only`,
      traceFileGlobs: ['.next/**/*.nft.json'],
    });
    expect(filePaths.length).toBeGreaterThan(1);
    expect(filePaths).toMatchSnapshot(); // save an example
  });
  it('should combine both trace dependencies of existing trace output files and of files we need to trace', async () => {
    const filePaths = await defineAllTracedFilesSpecified({
      projectRootDirectory: `${TEST_ASSETS_DIRECTORY}/nextjs-mui-project-next-dir-only`,
      traceFileGlobs: ['dist/handler.js', '.next/**/*.nft.json'],
    });
    expect(filePaths.length).toBeGreaterThan(1);
    expect(filePaths).toContain('dist/handler.js'); // to show that it did grab the handler
    expect(filePaths).toContain('dist/server.js'); // to show that it did grab the handler's dependency
    expect(filePaths).toContain('.next/server/webpack-runtime.js'); // to show it did grab the .next directory things
    expect(filePaths).toMatchSnapshot(); // save an example
  });
  it('should trace pnpm dependencies including symlinks and their targets', async () => {
    // This test verifies that when tracing a project with pnpm-style symlinks,
    // both the symlinks and their real targets are included.
    //
    // pnpm creates symlinks like:
    //   node_modules/main-package -> .pnpm/main-package@1.0.0/node_modules/main-package
    //   node_modules/.pnpm/main-package@1.0.0/node_modules/@scope/nested-dep -> symlink to actual package
    //
    // The tracer returns both:
    //   - The symlink paths (node_modules/main-package)
    //   - The real file paths (.pnpm/.../index.js)
    //
    // When we preserve symlinks during copy (instead of dereferencing), the
    // artifact maintains the same structure and Node.js resolution works naturally.
    const filePaths = await defineAllTracedFilesSpecified({
      projectRootDirectory: `${TEST_ASSETS_DIRECTORY}/lambda-project-pnpm-deps`,
      traceFileGlobs: ['dist/handler.js'],
    });

    // Should include the handler itself
    expect(filePaths).toContain('dist/handler.js');

    // Should include the root-level symlink to main-package
    expect(filePaths).toContain('node_modules/main-package');

    // Should include the real main-package files in .pnpm
    expect(filePaths).toContain(
      'node_modules/.pnpm/main-package@1.0.0/node_modules/main-package/index.js',
    );

    // Should include the nested symlink within .pnpm structure
    expect(filePaths).toContain(
      'node_modules/.pnpm/main-package@1.0.0/node_modules/@scope/nested-dep',
    );

    // Should include the real nested-dep files in .pnpm
    expect(filePaths).toContain(
      'node_modules/.pnpm/@scope+nested-dep@1.0.0/node_modules/@scope/nested-dep/index.js',
    );
  });
});
