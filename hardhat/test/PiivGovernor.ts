import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "../hardhat.config";

describe("PiivGovernor", function () {
  async function deployPiivTimeLockFixture() {
    const [deployer, otherAccount] = await ethers.getSigners();

    const PiivTimeLock = await ethers.getContractFactory("PiivTimelock");
    const piivTimeLock = await PiivTimeLock.deploy(constants.MIN_DELAY, [], []);
    const piivTimeLockAddress = await piivTimeLock.getAddress();

    const PiivGovToken = await ethers.getContractFactory("PiivGovToken");
    const piivGovToken = await PiivGovToken.deploy();
    const piivGovTokenAddress = await piivGovToken.getAddress();

    const PiivGovernor = await ethers.getContractFactory("PiivGovernor");
    const piivGovernor = await PiivGovernor.deploy(
      piivGovTokenAddress,
      piivTimeLockAddress
    );

    return { deployer, otherAccount, piivGovToken, piivTimeLock, piivGovernor };
  }

  describe("Deployment", function () {
    it("Should have deployed correctly", async function () {
      const { piivGovernor } = await loadFixture(deployPiivTimeLockFixture);
      const address = await piivGovernor.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should have correct token and timelock", async function () {
      const { piivGovernor, piivGovToken, piivTimeLock } = await loadFixture(
        deployPiivTimeLockFixture
      );
      const token = await piivGovernor.token();
      expect(token).to.equal(await piivGovToken.getAddress());

      const timelock = await piivGovernor.timelock();
      expect(timelock).to.equal(await piivTimeLock.getAddress());
    });
  });
});
