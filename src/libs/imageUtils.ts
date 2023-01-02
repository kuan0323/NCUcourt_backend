import * as stream from 'stream';
import * as probe from 'probe-image-size';
import { IllegalArgumentError } from "../exceptions/illegalArgumentError";

export class ImageInfo {

    public width: number;
    public height: number;
    public format: string;

    constructor (width = 0, height = 0, format = 'jpg') {
        this.width = width
        this.height = height
        this.format = format
    }
}

export class ImageUtils {

    static async probe (content: Buffer): Promise<ImageInfo> {
        try {
            const Readable = stream.Readable;
            const s = new Readable();
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            s._read = () => {}; // redundant? see update below
            s.push(content);
            s.push(null);
            const result = await probe(s);
            if (result.orientation >= 5) {
                return new ImageInfo(result.height, result.width, result.type);
            } else {
                return new ImageInfo(result.width, result.height, result.type);
            }
        } catch (e) {
            throw new IllegalArgumentError('image format not accepted.');
        }
    }
}