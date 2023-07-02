import { ethers } from "hardhat";
import { deployPiivGovernor } from "./deployments/deploy-piivGovernor";
import { deployPiivIssuer } from "./deployments/deploy-piivIssuer";

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("🧪 Starting deployments with address: " + deployerAddress);
  const { piivGovernorAddress } = await deployPiivGovernor({
    deployerAddress,
  });
  await deployPiivIssuer({ deployerAddress, piivGovernorAddress });
  console.log("🎉 Deployments completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
