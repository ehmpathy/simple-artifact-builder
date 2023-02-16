import { Command, Flags } from '@oclif/core';

import { zip } from '../../logic/commands/zip';

// eslint-disable-next-line import/no-default-export
export default class Zip extends Command {
  public static description = 'builds and zips the artifact';

  public static flags = {
    help: Flags.help({ char: 'h' }),
    config: Flags.string({
      char: 'c',
      description: 'path to the artifact config yml',
      required: true,
      default: 'artifact.yml',
    }),
  };

  public async run() {
    const { flags } = await this.parse(Zip);
    const config = flags.config!;

    // define config path
    const absoluteConfigPath =
      config.slice(0, 1) === '/' ? config : `${process.cwd()}/${config}`; // if starts with /, consider it as an absolute path
    await zip({ absoluteConfigPath });
  }
}
