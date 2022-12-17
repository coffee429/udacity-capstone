import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export class AttachmentUtils {
    constructor() { };
    
    getSignedS3Url(todoId: string, bucket: string): string {
        const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
        const signedUrl = s3.getSignedUrl('putObject', {
            Bucket: bucket,
            Key: todoId,
            Expires: urlExpiration
        });
        return signedUrl;
    }
}