import { Command } from './command.interface.js';
import chalk from 'chalk';
import { CommandName } from '../../consts.js';

const VIOLET = [85, 37, 187] as const;

export class HelpCommand implements Command {
  public getName(): string {
    return CommandName.Help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.rgb(255, 0, 198)('Программа для подготовки данных для REST API сервера.')}

        Пример: cli.js --<${chalk.blue('command')}> [${chalk.rgb(188, 188, 188)('--arguments')}]

        Команды:

            ${chalk.green('--version:')}                   ${chalk.rgb(...VIOLET)('# выводит номер версии')}
            ${chalk.green('--help:')}                      ${chalk.rgb(...VIOLET)('# печатает этот текст')}
            ${chalk.green('--import')} <path>:             ${chalk.rgb(...VIOLET)('# импортирует данные из TSV')}
            ${chalk.green('--generate')} <path> <url>             ${chalk.rgb(...VIOLET)('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
