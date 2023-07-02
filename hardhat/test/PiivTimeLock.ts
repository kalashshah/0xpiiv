import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "../hardhat.config";

describe("PiivTimeLock", function () {
  async function deployPiivTimeLockFixture() {
    const [deployer, otherAccount] = await ethers.getSigners();

    const PiivTimeLock = await ethers.getContractFactory("PiivTimelock");
    const piivTimeLock = await PiivTimeLock.deploy(
      constants.MIN_DELAY,
      [],
      [],
      deployer.address
    );

    return { piivTimeLock, deployer, otherAccount };
  }

  describe("Deployment", function () {
    it("Should have deployed correctly", async function () {
      const { piivTimeLock } = await loadFixture(deployPiivTimeLockFixture);
      const address = await piivTimeLock.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should have correct min delay", async function () {
      const { piivTimeLock } = await loadFixture(deployPiivTimeLockFixture);
      const minDelay = await piivTimeLock.getMinDelay();
      expect(minDelay).to.equal(constants.MIN_DELAY);
    });
  });
});
