import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { CommandName, EventList } from '../../consts.js';
import { Offer } from '../../shared/types/offer.type.js';
import { getErrorMessage } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public get name(): string {
    return CommandName.Import;
  }

  public async execute(...parameters: string[]): Promise<void> {
    // Чтение файла
    const [filename] = parameters;

    try {
      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on(EventList.Line, this.onImportedOffer);
      fileReader.on(EventList.End, this.onCompleteImport);
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
