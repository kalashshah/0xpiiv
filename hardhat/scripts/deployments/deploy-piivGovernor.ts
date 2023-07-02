import type { PiivTimelock } from "../../typechain-types";
import { deployPiivGovToken } from "./deploy-piivGovToken";
import { deployPiivTimeLock } from "./deploy-piivTimeLock";
import { ethers } from "hardhat";

interface DeployPiivGovernorOptions {
  deployerAddress: string;
}

interface SetupInitialRolesGovernorOptions {
  deployerAddress: string;
  piivTimelock: PiivTimelock;
  piivGovernorAddress: string;
}

export const deployPiivGovernor = async ({
  deployerAddress,
}: DeployPiivGovernorOptions) => {
  const { piivGovToken, piivGovTokenAddress } = await deployPiivGovToken();
  const { piivTimelock, piivTimelockAddress } = await deployPiivTimeLock({
    deployerAddress,
  });
  console.log("🚀 Deploying Governor.....");
  const piivGovernor = await ethers.deployContract("PiivGovernor", [
    piivGovTokenAddress,
    piivTimelockAddress,
  ]);
  await piivGovernor.waitForDeployment();
  const piivGovernorAddress = await piivGovernor.getAddress();
  console.log("✅ Deployed Governor at:", piivGovernorAddress);
  await setupInitialRoles({
    deployerAddress,
    piivTimelock,
    piivGovernorAddress,
  });
  return {
    piivGovernorAddress,
    piivGovernor,
    piivGovToken,
    piivGovTokenAddress,
    piivTimelock,
    piivTimelockAddress,
  };
};

const setupInitialRoles = async ({
  deployerAddress,
  piivTimelock,
  piivGovernorAddress,
}: SetupInitialRolesGovernorOptions) => {
  console.log("🌀 Setting up initial roles.....");
  const proposerRole = await piivTimelock.PROPOSER_ROLE();
  const executorRole = await piivTimelock.EXECUTOR_ROLE();
  const adminRole = await piivTimelock.TIMELOCK_ADMIN_ROLE();

  const proposerTx = await piivTimelock.grantRole(
    proposerRole,
    piivGovernorAddress
  );
  await proposerTx.wait(1);

  const executorTx = await piivTimelock.grantRole(
    executorRole,
    ethers.ZeroAddress
  );
  await executorTx.wait(1);

  const revokeAdminTx = await piivTimelock.revokeRole(
    adminRole,
    deployerAddress
  );
  await revokeAdminTx.wait(1);
  console.log("✅ Completed initial roles setup for Governor");
};
