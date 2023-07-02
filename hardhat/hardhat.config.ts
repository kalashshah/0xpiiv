import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

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
  networks: {
    hardhat: {},
    // zkEVM: {
    //   chainId: 1442,
    //   url: "https://rpc.public.zkevm-test.net",
    //   accounts: [process.env.ZKEVM_PRIVATE_KEY as string],
    // },
    polygon_mumbai: {
      url: "https://tame-cosmopolitan-violet.matic-testnet.discover.quiknode.pro/3e6de038de14a63965f8bd96cc3c52b4d32fc918/",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};
export default config;
