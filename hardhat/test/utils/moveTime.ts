import { network } from "hardhat";

export const moveTime = async (amount: number) => {
  await network.provider.send("evm_increaseTime", [amount]);
};
