import { PiivIssuer } from "../../typechain-types";
import { ethers } from "hardhat";

interface DeployPiivIssuerOptions {
  piivGovernorAddress: string;
  deployerAddress: string;
}

interface TransferOwnershipOptions {
  piivGovernorAddress: string;
  piivIssuer: PiivIssuer;
  deployerAddress: string;
}

export const deployPiivIssuer = async ({
  piivGovernorAddress,
  deployerAddress,
}: DeployPiivIssuerOptions) => {
  console.log("🚀 Deploying Issuer.....");
  const piivIssuer = await ethers.deployContract("PiivIssuer");
  await piivIssuer.waitForDeployment();
  const piivIssuerAddress = await piivIssuer.getAddress();
  console.log("✅ Deployed Issuer at:", piivIssuerAddress);
  await transferOwnership({
    piivGovernorAddress,
    piivIssuer,
    deployerAddress,
  });

  return {
    piivIssuer,
    piivIssuerAddress,
  };
};

const transferOwnership = async ({
  piivGovernorAddress,
  piivIssuer,
  deployerAddress,
}: TransferOwnershipOptions) => {
  console.log("🌀 Transferring ownership.....");
  await piivIssuer.transferOwnership(piivGovernorAddress, {
    from: deployerAddress,
  });
  console.log("✅ Transferred ownership to Governor");
};
