#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CsvToDynamodbStack } from '../lib/csv-to-dynamodb-stack';

const app = new cdk.App();
new CsvToDynamodbStack(app, 'CsvToDynamodbStack');
