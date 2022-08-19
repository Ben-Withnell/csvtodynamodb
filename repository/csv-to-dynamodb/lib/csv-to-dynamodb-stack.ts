import * as cdk from 'aws-cdk-lib';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
//import * as sns from 'aws-cdk-lib/aws-sns';
//import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
//import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as s3  from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb  from 'aws-cdk-lib/aws-dynamodb';

export class CsvToDynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const queue = new sqs.Queue(this, 'CsvToDynamodbQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    //});
    //const topic = new sns.Topic(this, 'CsvToDynamodbTopic');
    //topic.addSubscription(new subs.SqsSubscription(queue));
    
    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      bucketName: "news3bucketfordeployingawslambdacdk",
    });
    const table = new dynamodb.Table(this, "postcodeTable", {
      tableName: "postcodeTable",
      partitionKey: { name: "Postcode", type: dynamodb.AttributeType.STRING },
    });
    const newlambda = new lambda.Function(
      this,
      "CircleCiGwpLambda",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "index.handler",
        timeout: cdk.Duration.seconds(30),
        code: lambda.Code.fromAsset("lambda/"),
        environment: {
          TABLE_NAME: table.tableName,
          BUCKET_NAME: bucket.bucketName
        },
      }
    );
    bucket.grantPut(newlambda);
    bucket.grantRead(newlambda)
    table.grantReadWriteData(newlambda);
    
    
    
  }
}
