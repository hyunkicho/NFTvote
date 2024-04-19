import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "dotenv/config";
import "@nomiclabs/hardhat-ethers";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    arb: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY!]
    }
  },
  solidity: {
    version : "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  gasReporter: {
    enabled: true,
    // currency: "KRW",
  },
};

export default config;
