import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.rgb(255, 0, 198)('Программа для подготовки данных для REST API сервера.')}
        ${chalk.rgb(188, 188, 188)('Пример:')}
          ${chalk.rgb(188, 188, 188)('cli.js --<command> [--arguments]')}
        Команды:
            ${chalk.rgb(112, 255, 0)('--version:                   # выводит номер версии')}
            ${chalk.rgb(2, 212, 225)('--help:                      # печатает этот текст')}
            ${chalk.rgb(85, 37, 187)('--import <path>:             # импортирует данные из TSV')}
    `);
  }
}
