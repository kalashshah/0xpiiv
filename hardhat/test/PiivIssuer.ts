import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PiivIssuer", function () {
  async function deployPiivIssuerFixture() {
    const [deployer, piivGovernor] = await ethers.getSigners();

    const PiivIssuer = await ethers.getContractFactory("PiivIssuer");
    const piivIssuer = await PiivIssuer.deploy();

    return { piivIssuer, deployer, piivGovernor };
  }

  describe("Deployment", function () {
    it("Should have deployed correctly", async function () {
      const { piivIssuer, deployer } = await loadFixture(
        deployPiivIssuerFixture
      );
      const address = await piivIssuer.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
      expect(await piivIssuer.owner()).to.equal(await deployer.getAddress());
    });
  });

  describe("Transfer ownership to governance", function () {
    it("Should have transferred ownership correctly", async function () {
      const { piivIssuer, deployer, piivGovernor } = await loadFixture(
        deployPiivIssuerFixture
      );
      await piivIssuer.transferOwnership(piivGovernor.address, {
        from: deployer.address,
      });
      expect(await piivIssuer.owner()).to.equal(piivGovernor.address);
    });
  });
});
