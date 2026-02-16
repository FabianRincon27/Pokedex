// “Simulamos una base de datos sin depender de un motor real”.

import { promises as fs } from 'fs';
import * as path from 'path';

export class FileDB<T> {
    private filePath: string;

    constructor(filename: string) {
        this.filePath = path.join(process.cwd(), 'src/db', filename);
    }

    async read(): Promise<T[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async write(data: T[]): Promise<void> {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }
}
