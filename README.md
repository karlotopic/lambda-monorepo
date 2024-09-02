# lambda-monorepo

This repository is used to develop and deploy multiple Lambda functions inside a single repo.

## Directory structure

Each lambda function should have a separate directory inside the lambda directory of this repository.

The entry file of a lambda function is an `index.mjs` file containing the following method:

```
export const handler = async (event) => {
};
```

The [handler method](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html) is being executed when the Lambda function triggers.

## CI/CD

Since this is a monorepo consisting of multiple lambda functions, each lambda function should have a corresponding yaml file.

The breakdown of the function-1.yaml file will be presented in the lines following:

```
name: Function 1
on:
  push:
    branches:
      - master
    paths:
      - "function-1/**"
      - ".github/workflows/**"
jobs:
  function-1:
    name: Zip and deploy function-1
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1
      - run: zip -j function-1.zip ./function-1/index.mjs
      - run: aws lambda update-function-code --function-name=awsLambdaFunctionName --zip-file=fileb://function-1.zip
```

This repository setup assumes that you have a single Lambda function across multiple environments. In our current configuration, environment-specific variables are passed to the Lambda function through the payload.

You can find an architectural setup example where a Lambda function is used as a scheduler across multiple environments [here](https://docs.google.com/document/d/1Qjvczzj6wyqqSbyXPciYhCrTW6l9zM8Auo56gP-C-dE).

The most important part of the yaml file is the paths property:

```
    paths:
      - "function-1/**"
      - ".github/workflows/**"
```

This yaml file is triggering the function-1 lambda function deployment if the function-1 directory is changed.

The following line is zipping the lambda function file (change the names accordingly):

```
 - run: zip -j function-1.zip ./function-1/index.js
```

The following line is uploading the zipped file to the lambda service (name should correspond to the given name on the Lambda service):

```
 - run: aws lambda update-function-code --function-name=awsLambdaFunctionName --zip-file=fileb://function-1.zip
```

## Local development with Node.js

### Description

This flow is testing the handler method exported from the index.mjs file of a specific Lamda function using Node.js.

### Prerequisites

1. [Node.js](https://nodejs.org/en/download/package-manager)

### Setup

1. **Install the necessary npm packages.**

   If your Lambda function relies on npm packages (such as pg, sequelize, etc.), make sure these packages are listed in the _lambda/package.json_ file. If they aren't, add them to the _dependencies_ section.

   Run `npm i`.

2. **First time running local env**

   Create an .env file containing environment-specific variables that will be sent to the handler method of the Lambda function.

3. **Modify ./index.mjs file**

   Import the handler method of a specific lambda function inside the _./index.mjs_ file.

   Now you can add a new switch case statement that will trigger your lambda function.

   ```
    import * as newLambda from "../lambda/newLambda/index.mjs";

    switch (lambdaFunctionName) {
      case "new-lambda":
        newLambda
          .handler({
            conString: process.env.conString, // sending the required connection string as an input parameter to the handler.
          })
          .then((res) => console.log(res));
        break;
    }
   ```

   Don't forget to send the required variables to the handler method.

4. **Execute the script**

   Run the `node index.mjs` command. The script will prompt you which lambda function to execute.

&nbsp;
