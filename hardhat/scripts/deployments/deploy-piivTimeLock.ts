import { ethers } from "hardhat";
import { constants } from "../../hardhat.config";

interface DeployPiivTimeLockOptions {
  deployerAddress: string;
}

export const deployPiivTimeLock = async ({
  deployerAddress,
}: DeployPiivTimeLockOptions) => {
  console.log("🚀 Deploying Timelock.....");
  const piivTimelock = await ethers.deployContract("PiivTimelock", [
    constants.MIN_DELAY,
    [],
    [],
    deployerAddress,
  ]);
  await piivTimelock.waitForDeployment();
  const piivTimelockAddress = await piivTimelock.getAddress();
  console.log("✅ Deployed Timelock at:", piivTimelockAddress);
  return {
    piivTimelockAddress,
    piivTimelock,
  };
};
