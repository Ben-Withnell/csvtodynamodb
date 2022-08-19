console.log('Loading function');
const aws = require('aws-sdk');
//const csv = require('csvtojson');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    }; 
    

    csvToJSON(params);
    
    try {
        const { ContentType } = await s3.getObject(params).promise();
        console.log('CONTENT TYPE:', ContentType);
        //console.log(s3.getObject(params))
        
        return ContentType;
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
    
    //let inputStream = Fs.createReadStream(obj, 'utf8');
};

async function csvToJSON(params) {
    const stream = s3.listObject(params).promise()
    .then((data) => data.Contents[0].Size)
    .then((max) => stream(0, max));
    
    //const json = await csv().fromStream(stream);
    console.log(stream);
};