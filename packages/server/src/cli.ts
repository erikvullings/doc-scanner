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
  typeLabel: string;
}

export interface ICommandOptions {
  port: number;
  folder: string;
  help: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: FixedOptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      typeLabel: '[underline]{Boolean}',
      description: 'Show help text'
    },
    {
      name: 'port',
      alias: 'p',
      type: Number,
      defaultValue: 8765,
      typeLabel: '[underline]{Number}',
      description: 'Port address'
    },
    {
      name: 'folder',
      alias: 'f',
      type: String,
      typeLabel: '[underline]{String}',
      description: 'Comma separated list of data folders that contain the Office|PDF documents'
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
          desc: '01. Serve the data folder on port 8123',
          example: '$ doc-scanner "C:\\Users\\[USERNAME]\\Documents"'
        },
        {
          desc: '02. Serve the data folder on port 80',
          example: '$ doc-scanner "C:\\Users\\[USERNAME]\\Documents" -p 80'
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