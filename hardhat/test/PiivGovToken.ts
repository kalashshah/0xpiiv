import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "../hardhat.config";

describe("PiivGovToken", function () {
  async function deployPiivGovTokenFixture() {
    console.log("deployPiivGovTokenFixture");
    const [deployer, otherAccount] = await ethers.getSigners();

    const PiivGovToken = await ethers.getContractFactory("PiivGovToken");
    const piivGovToken = await PiivGovToken.deploy();

    return { piivGovToken, deployer, otherAccount };
  }

  describe("Deployment", function () {
    it("Should have deployed correctly", async function () {
      const { piivGovToken } = await loadFixture(deployPiivGovTokenFixture);
      const address = await piivGovToken.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should have correct max supply", async function () {
      const { piivGovToken } = await loadFixture(deployPiivGovTokenFixture);

      expect(await piivGovToken.s_maxSupply()).to.equal(constants.MAX_SUPPLY);
    });

    it("Should mint all tokens to msg.sender", async function () {
      const { piivGovToken, deployer } = await loadFixture(
        deployPiivGovTokenFixture
      );

      expect(await piivGovToken.balanceOf(deployer.address)).to.equal(
        constants.MAX_SUPPLY
      );
    });
  });
});
