import commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';

const npmPackage = require('../package.json') as {
  name: string;
  version: string;
  license: string;
  description: string;
};

/**
 * Adds missing properties from typings.
 */
export interface FixedOptionDefinition extends OptionDefinition {
  description: string;
}

export interface ICommandOptions {
  port: number;
  watch: boolean;
  folder: string;
  help: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: FixedOptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      description: 'Show help text'
    },
    {
      name: 'watch',
      alias: 'w',
      type: Boolean,
      defaultValue: false,
      description: 'Watch the folders for changes'
    },
    {
      name: 'port',
      alias: 'p',
      type: Number,
      defaultValue: 8765,
      description: 'Port address'
    },
    {
      name: 'folder',
      alias: 'f',
      type: String,
      defaultOption: true,
      defaultValue: `C:\\Users\\${process.env.USERNAME}\\Documents`,
      description: 'Comma-separated list of data folders that contain the Office and PDF documents'
    },
  ];

  static sections = [
    {
      header: `${npmPackage.name}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}

    The output can be viewed at "http://HOSTNAME:PORT/".`
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [
        {
          desc: '01. Serve the data folder on port 8765',
          example: '$ doc-scanner "C:\\Users\\[USERNAME]\\Documents"'
        },
        {
          desc: '02. Serve the data folder on port 80 (http://localhost)',
          example: '$ doc-scanner -p 80 "C:\\Users\\[USERNAME]\\Documents"'
        },
        {
          desc: '02. Serve the data folder and keep watching for changes',
          example: '$ doc-scanner -w "C:\\Users\\[USERNAME]\\Documents"'
        }
      ]
    }
  ];
}

export const options = commandLineArgs(
  CommandLineInterface.optionDefinitions
) as ICommandOptions;

if (options.help) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(0);
}