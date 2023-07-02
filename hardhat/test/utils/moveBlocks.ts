import { network } from "hardhat";

export const moveBlocks = async (blocks: number) => {
  for (let i = 0; i < blocks; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
};
