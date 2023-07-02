import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

export const constants = {
  MAX_SUPPLY: BigInt("1000000000000000000000000"),
  MIN_DELAY: 1800, // 30 minutes
};

const config: HardhatUserConfig = {
  solidity: "0.8.9",
};

export default config;
