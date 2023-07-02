import { ethers } from "hardhat";
import { constants } from "../../hardhat.config";

export const deployPiivGovToken = async () => {
  console.log("🚀 Deploying Governance Token.....");
  const piivGovToken = await ethers.deployContract("PiivGovToken", {
    libraries: {
      SpongePoseidon: constants.SPONGE_POSEIDON_LIB_MUMBAI,
      PoseidonUnit6L: constants.POSEIDON6_LIB_MUMBAI,
    },
  });
  await piivGovToken.waitForDeployment();
  const piivGovTokenAddress = await piivGovToken.getAddress();
  console.log("✅ Deployed Governance Token at:", piivGovTokenAddress);
  return {
    piivGovTokenAddress,
    piivGovToken,
  };
};
