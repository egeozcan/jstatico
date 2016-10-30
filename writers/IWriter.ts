import FileResult, { FileResultArray } from "../models/FileResult"

export interface IWriter {
	match: RegExp;
	write: (self: FileResult, homePath: string, destinationPath: string) => Promise<void>;
}