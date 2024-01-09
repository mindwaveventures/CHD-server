interface IConfig {
    mode: string;
    apiVersion: string;
    port: number;
    dbDialect: string;
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort: number;
    JWTSalt: string;
    jwtTokenAlgorithm: string;
    jwtAccessTokenExpiresIn: string;
    jwtRefreshTokenExpiresIn: string;
    host: string;
    dbInstanceName: string;
    jwtAccessTokenSecretKey: string;
    jwtRefershTokenSecretKey: string;
    sendGridApi: string;
    emailHost: string
    emailPort: number;
    emailAuthUsername: string;
    emailAuthPassword: string;
    useSendgrid: boolean;
    fromMail: string;
    appURL: string;
    messageBirdKey: string;
    azureConnectionString: string;
    azureSubscriptionId: string;
    resourceGroup: string;
    azureManageIdentity: string;
    azureCommonQueue: string;
    rateLimitInterval: number;
    rateLimit: number;
    // azureTenantId: string;
    // azureClientId: string;
    // azureSecretKey: string;
}

export default IConfig;
