import { Bucket, GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Service } from 'typedi';
import { ImageStorage } from './imageStorage';

@Service()
@Service('ImageStorage')
export class GCPImageStorage implements ImageStorage {

    private storage: Storage;
    private imageBucket: Bucket;
    private static BUCKET_NAME = 'ncu-dev-image';

    constructor () {
        this.storage = new Storage();
        this.imageBucket = this.storage.bucket(GCPImageStorage.BUCKET_NAME);
    }

    upload (name: string, content: Buffer): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        return new Promise(function(resolve, reject) {
            const blob = self.imageBucket.file(name)
            const blobStream = blob.createWriteStream()
            blobStream.on('error', (err) => {
                console.log('[Error]: image upload to gcp failed: ', err)
                reject(err);
            })
            blobStream.on('finish', () => {
                const publicUrl = 
                    `https://storage.googleapis.com/${GCPImageStorage.BUCKET_NAME}/${name}`
                resolve(publicUrl)
            })
            blobStream.end(content)
        })
    }

    async delete (name: string): Promise<void> {
        try {
            await this.imageBucket.file(name).delete()
        } catch (e) {
            console.error(e)
            // ignore No such object Error
        } 
    }
}

export default GCPImageStorage;
