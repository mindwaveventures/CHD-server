# WNB Server

## How to run

1. Clone repository. (WNB Server)
2. `cd server`
3. `npm install`
4. create **.env** in root directory (WNB). For more details about configuration see [here](#configuration).
5. `npm run dev`

## Configuration

|              Name              | Type   | Default                                    | Description                                                                            |
| :----------------------------: | :----- | :----------------------------------------- | :------------------------------------------------------------------------------------- |
|           **`host`**           | string | localhost                                  | Server bind address.                                                                   |
|           **`port`**           | number | 3002                                       | Port to listen.                                                                        |
|          **`dbHost`**          | string | localhost                                  | Database server host name or ip.                                                       |
|          **`dbPort`**          | number | 5432                                       | Database server port number.                                                           |
|          **`dbName`**          | string |                                            | Database name to connect.                                                              |
|        **`dbDialect`**         | string | postgres                                      | Database type. Allowed values are 'sqlite', 'mysql', 'mariadb', 'postgres' and 'mssql' |
|         **`dbUser`**           | string |                                            | Database user name.                                                                    |
|        **`dbPassword`**        | string |                                            | Database password.                                                                     |
|      **`dbInstanceName`**      | string |                                            | Named instance of MSSQL server (Ex: SQLExpress)                                        |                                                                       |
|    **`jwtTokenAlgorithm`**     | string | HS256                                      | JWT algorithm.                                                                         |
| **`jwtAccessTokenSecretKey`**  | string |                                            | Access token's secret key.                                                             |
| **`jwtAccessTokenExpiresIn`**  | string | 1d                                         | Access token's expiry time.                                                            |
| **`jwtRefreshTokenSecretKey`** | string |                                            | Refresh token's secret key.                                                            |
| **`jwtRefreshTokenExpiresIn`** | string | 90 days                                    | Refresh token's expiry time.                                                           |
|        **`NODE_ENV`**          | string | development                                | Sequelize node environment ip.                                                                 |
|        **`mode`**              | string | development                                | Our server mode                                                                     |
|        **`sendGridApi`**       | string |                                            | Send grid API Key                                                                     |
|        **`emailHost`**              | string |                                            | Email host                                                                    |
|        **`emailPort`**              | string |                                 | Email port                                                                    |
|        **`emailAuthUsername`**              | string |                                | Email account username mode                                                                     |
|        **`emailAuthPassword`**              | string |                                 | Email account password mode                                                                     |
|        **`useSendgrid`**              | string | true                                | Enable send grid in nodemailer mode                                                                     |
|        **`fromMail`**              | string |                                 | mail will be received from                                                                     |
|        **`appURL`**              | string |                                | Front end app url                                                                    |
|        **`messageBirdKey`**              | string |                               | Messagebird API key         
|        **`azureConnectionString`**             | string |                          |  Azure connection string to create queue
|        **`AZURE_TENANT_ID`**          | string |                  |   Azure Tenant ID
|        **`AZURE_CLIENT_ID`**           | string |                 | Azure Client ID
|       **`AZURE_CLIENT_SECRET`**        | string |                 | Azure Client Secret
|        **`azureSubscriptionId`**       | string |                 | Azure subscription ID
|        **`resourceGroup`**             | string |                 | Resource Group

## Dev Reference

**Create migration file**

`npx sequelize-cli migration:generate --name <file_name>`

**Alter Table**

`npx sequelize-cli migration:create --name`

**Create Model**

`npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`

**Running Migrations**

`npx sequelize-cli db:migrate`

**Undoing Migrations**

`npx sequelize-cli db:migrate:undo`

**Create Seed File**

`npx sequelize-cli seed:generate --name <file_name>`

**Running Seeds**

`npx sequelize-cli db:seed:all`

**Undoing Seeds**

`npx sequelize-cli db:seed:undo`

**Undoing specific seed**

`npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data`

**Undoing all seeds**

`npx sequelize-cli db:seed:undo:all`
