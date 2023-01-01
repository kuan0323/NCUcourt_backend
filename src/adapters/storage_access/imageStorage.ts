
export interface ImageStorage {
    upload (name: string, content: Buffer): Promise<string>;
    delete (name: string): Promise<void>;
}
