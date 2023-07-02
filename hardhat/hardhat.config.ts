import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

export const constants = {
  MAX_SUPPLY: BigInt("1000000000000000000000000"),
  MIN_DELAY: 1800, // 30 minutes
  SPONGE_POSEIDON_LIB_MUMBAI: "0x12d8C87A61dAa6DD31d8196187cFa37d1C647153",
  POSEIDON6_LIB_MUMBAI: "0xb588b8f07012Dc958aa90EFc7d3CF943057F17d7",
  PROPOSAL_DESCRIPTION: "This is a test proposal",
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
