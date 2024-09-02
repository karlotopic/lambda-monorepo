import "dotenv/config";
import readline from "node:readline";
import * as lambda1 from "./lambda/lambda1/index.mjs";
import * as lambda2 from "./lambda/lambda2/index.mjs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  `Which lambda function do you want to run?`,
  (lambdaFunctionName) => {
    main(lambdaFunctionName);
    rl.close();
  }
);

const main = (lambdaFunctionName) => {
  switch (lambdaFunctionName) {
    case "function-1":
      lambda1
        .handler({
          param1: process.env.PARAM1,
        })
        .then((res) => console.log(res));
      break;
    case "function-2":
      lambda2
        .handler({
          param1: process.env.PARAM1,
          param2: process.env.PARAM2,
        })
        .then((res) => console.log(res));
      break;
  }
};
