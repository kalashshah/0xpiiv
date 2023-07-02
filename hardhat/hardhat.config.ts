import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

export const constants = {
  MAX_SUPPLY: BigInt("1000000000000000000000000"),
  MIN_DELAY: 1800, // 30 minutes
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

export default config;
