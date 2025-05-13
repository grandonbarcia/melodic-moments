'use server';

import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export default async function getListOfObjects() {
  const bucketName = 'melodic-moments';

  try {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
      })
    );
    console.log('Success', data);
    if (data.Contents) {
      return data.Contents.map((object) => object.Key);
    }

    return [];
  } catch (error) {
    console.error('Error fetching objects:', error);
    throw error;
  }
}
