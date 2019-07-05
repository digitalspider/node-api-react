const AWS = require('aws-sdk');
const logger = require('./LoggerService');
const _ = require('lodash');

class AmazonSecretService {
    constructor() {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        this.awsSecretManager = new AWS.SecretsManager({
            region: process.env.AWS_REGION,
        });
        this.secretsCache = {};
        this.cacheReset = {};
    }

    async getSecret(keyPrefix, secretName) {
        let secrets = await this.getSecretsFromCache(secretName);
        if (secrets) {
            // return a single key if exists
            if (keyPrefix in secrets) {
                return secrets[keyPrefix];
            }

            // filter keys by keyPrefix
            let keysToReturn = Object.keys(secrets)
                .filter((keyName) => keyName.startsWith(keyPrefix));
            let secretsToReturn = _.pick(secrets, keysToReturn);
            return secretsToReturn;
        }
    }

    async getSecretsFromCache(secretName) {
        secretName = this.getSecretName(secretName);
        if (!this.secretsCache[secretName]) {
            this.secretsCache[secretName] = await
                this.getSecretsFromAWS(secretName);
            this.cacheReset[secretName] = false;
        }
        return this.secretsCache[secretName];
    }

    clearSecretsFromCache(secretName) {
        secretName = this.getSecretName(secretName);
        this.secretsCache[secretName] = null;
        this.cacheReset[secretName] = true;
        return `Cache ${secretName} has been reset`;
    }

    isCacheReset(secretName) {
        secretName = this.getSecretName(secretName);
        return this.cacheReset[secretName];
    }

    getSecretName(secretName) {
        return secretName ? secretName : process.env.AWS_SECRETS_NAME;
    }

    async getSecretsFromAWS(secretName) {
        logger.info(
            `AmazonSecretService. Getting new secrets for ${secretName}.`
        );

        let awsRequest =
            this.awsSecretManager.getSecretValue({SecretId: secretName});
        let data = await awsRequest.promise();
        if ('SecretString' in data) {
            return JSON.parse(data.SecretString);
        } else {
            throw new Error(`Binary content from AWS SecretsManager
                is not yet supported`);
        }
    }
}

module.exports = new AmazonSecretService();
