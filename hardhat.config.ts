require("@nomiclabs/hardhat-waffle");
import "hardhat-gas-reporter"

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
/*task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});*/

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 import { resolve } from "path";
 import { config as dotenvConfig } from "dotenv";
 dotenvConfig({ path: resolve(__dirname, "./.env") });

 const alchemyApiKey = process.env.ALCHEMY_API_KEY;
 if (!alchemyApiKey) {
   throw new Error("Please set your ALCHEMY_API_KEY in a .env file");
 }



 module.exports = {
  solidity: "0.8.4",
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
        //blockNumber: 14296310
      }
    }
  }
};
