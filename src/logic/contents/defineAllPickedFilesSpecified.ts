import fastGlob from 'fast-glob';

export const defineAllPickedFilesSpecified = async ({
  projectRootDirectory,
  pickFileGlobs,
}: {
  projectRootDirectory: string;
  pickFileGlobs: string[];
}) => {
  // run glob against each glob given and pull back the files specified
  const filePaths = await fastGlob(pickFileGlobs, {
    cwd: projectRootDirectory,
    dot: true, // include files and directories starting with a dot (e.g., .next/)
  });
  return filePaths.sort();
};
