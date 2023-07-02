import { ethers } from "hardhat";

async function main() {
  const spongePoseidonLib = "0x12d8C87A61dAa6DD31d8196187cFa37d1C647153";
  const poseidon6Lib = "0xb588b8f07012Dc958aa90EFc7d3CF943057F17d7";

  const PiivGovToken = await ethers.deployContract("PiivGovToken", {
    libraries: {
      SpongePoseidon: spongePoseidonLib,
      PoseidonUnit6L: poseidon6Lib,
    },
  });
  await PiivGovToken.waitForDeployment();
  console.log("Gov Token deployed to:", PiivGovToken.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
