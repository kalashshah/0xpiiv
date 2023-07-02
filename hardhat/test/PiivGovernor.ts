import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "../hardhat.config";
import { moveBlocks } from "./utils/moveBlocks";
import { PiivGovernor, PiivIssuer } from "../typechain-types";
import { AddressLike } from "ethers";
import { moveTime } from "./utils/moveTime";

interface ProposeFixtureOptions {
  piivIssuer: PiivIssuer;
  piivGovernor: PiivGovernor;
  otherAccountAddress: AddressLike;
}

interface VoteFixtureOptions {
  piivGovernor: PiivGovernor;
  proposalId: number;
}

describe("PiivGovernor", function () {
  async function deployPiivGovernorFixture() {
    const [deployer, otherAccount] = await ethers.getSigners();

    const PiivTimeLock = await ethers.getContractFactory("PiivTimelock");
    const piivTimeLock = await PiivTimeLock.deploy(
      constants.MIN_DELAY,
      [],
      [],
      deployer.address
    );
    const piivTimeLockAddress = await piivTimeLock.getAddress();

    const PiivGovToken = await ethers.getContractFactory("PiivGovToken", {
      libraries: {
        SpongePoseidon: constants.SPONGE_POSEIDON_LIB_MUMBAI,
        PoseidonUnit6L: constants.POSEIDON6_LIB_MUMBAI,
      },
    });
    const piivGovToken = await PiivGovToken.deploy();
    const piivGovTokenAddress = await piivGovToken.getAddress();

    const PiivGovernor = await ethers.getContractFactory("PiivGovernor");
    const piivGovernor = await PiivGovernor.deploy(
      piivGovTokenAddress,
      piivTimeLockAddress
    );

    return { deployer, otherAccount, piivGovToken, piivTimeLock, piivGovernor };
  }

  async function deployPiivGovernorFixtureCompleteSetup() {
    const { deployer, otherAccount, piivGovernor, piivGovToken, piivTimeLock } =
      await loadFixture(deployPiivGovernorFixture);

    const proposerRole = await piivTimeLock.PROPOSER_ROLE();
    const executorRole = await piivTimeLock.EXECUTOR_ROLE();
    const adminRole = await piivTimeLock.TIMELOCK_ADMIN_ROLE();

    const proposerTx = await piivTimeLock.grantRole(
      proposerRole,
      await piivGovernor.getAddress()
    );
    await proposerTx.wait(1);

    const executorTx = await piivTimeLock.grantRole(
      executorRole,
      ethers.ZeroAddress
    );
    await executorTx.wait(1);

    const revokeAdminTx = await piivTimeLock.revokeRole(
      adminRole,
      deployer.address
    );
    await revokeAdminTx.wait(1);

    const PiivIssuer = await ethers.getContractFactory("PiivIssuer", deployer);
    const piivIssuer = await PiivIssuer.deploy();

    await piivIssuer.transferOwnership(await piivGovernor.getAddress());

    return {
      deployer,
      otherAccount,
      piivGovToken,
      piivTimeLock,
      piivGovernor,
      piivIssuer,
    };
  }

  describe("Deployment", function () {
    it("Should have deployed correctly", async function () {
      const { piivGovernor } = await loadFixture(deployPiivGovernorFixture);
      const address = await piivGovernor.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should have correct token and timelock", async function () {
      const { piivGovernor, piivGovToken, piivTimeLock } = await loadFixture(
        deployPiivGovernorFixture
      );
      const token = await piivGovernor.token();
      expect(token).to.equal(await piivGovToken.getAddress());

      const timelock = await piivGovernor.timelock();
      expect(timelock).to.equal(await piivTimeLock.getAddress());
    });
  });

  describe("Setup roles", function () {
    it("Should transfer roles", async function () {
      const { deployer, piivGovernor, piivTimeLock } = await loadFixture(
        deployPiivGovernorFixture
      );

      const piivGovernorAddress = await piivGovernor.getAddress();

      const proposerRole = await piivTimeLock.PROPOSER_ROLE();
      const executorRole = await piivTimeLock.EXECUTOR_ROLE();
      const adminRole = await piivTimeLock.TIMELOCK_ADMIN_ROLE();

      const hasAdminRole = await piivTimeLock.hasRole(
        adminRole,
        deployer.address
      );

      expect(hasAdminRole).to.equal(true);

      const proposerTx = await piivTimeLock.grantRole(
        proposerRole,
        piivGovernorAddress
      );
      await proposerTx.wait(1);

      const executorTx = await piivTimeLock.grantRole(
        executorRole,
        ethers.ZeroAddress
      );
      await executorTx.wait(1);

      const revokeAdminTx = await piivTimeLock.revokeRole(
        adminRole,
        deployer.address
      );
      await revokeAdminTx.wait(1);

      const hasAdminRoleAfter = await piivTimeLock.hasRole(
        adminRole,
        deployer.address
      );
      expect(hasAdminRoleAfter).to.equal(false);

      const hasProposerRole = await piivTimeLock.hasRole(
        proposerRole,
        piivGovernorAddress
      );

      expect(hasProposerRole).to.equal(true);

      const hasExecutorRole = await piivTimeLock.hasRole(
        executorRole,
        ethers.ZeroAddress
      );
      expect(hasExecutorRole).to.equal(true);
    });
  });

  describe("Propose and Vote", function () {
    async function proposeFixture() {
      const { otherAccount, piivGovernor, piivIssuer, deployer } =
        await loadFixture(deployPiivGovernorFixtureCompleteSetup);
      const encodedFunctionCall = piivIssuer.interface.encodeFunctionData(
        "addIssuer",
        [
          otherAccount.address,
          "did:idk:123",
          "Issuer Name",
          "Issuer Description",
          "cid:123",
        ]
      );
      const piivIssuerAddress = await piivIssuer.getAddress();
      const proposeTx = await piivGovernor.propose(
        [piivIssuerAddress],
        [0],
        [encodedFunctionCall],
        constants.PROPOSAL_DESCRIPTION
      );
      const proposeReceipt = await proposeTx.wait(1);
      const proposeResponse = ethers.AbiCoder.defaultAbiCoder().decode(
        [
          "uint256",
          "address",
          "address[]",
          "uint256[]",
          "string[]",
          "bytes[]",
          "uint256",
          "uint256",
          "string",
        ],
        proposeReceipt!.logs[0].data
      );
      return {
        proposeReceipt,
        proposeResponse,
        proposalId: proposeResponse[0],
        piivGovernor,
        piivIssuer,
        deployer,
        otherAccount,
      };
    }

    it("Should propose", async function () {
      const {
        proposeReceipt,
        proposeResponse,
        proposalId,
        piivGovernor,
        piivIssuer,
        deployer,
      } = await loadFixture(proposeFixture);
      expect(proposeReceipt).to.not.equal(null);
      expect(proposeReceipt?.logs).to.not.equal(undefined);
      expect(proposeReceipt?.logs.length).to.equal(1);

      const piivIssuerAddress = await piivIssuer.getAddress();

      expect(proposeResponse[1]).to.equal(deployer.address);
      expect(proposeResponse[2][0]).to.equal(piivIssuerAddress);
      expect(proposeResponse[3][0]).to.equal(0);
      expect(proposeResponse[8]).to.equal(constants.PROPOSAL_DESCRIPTION);

      const proposalSnapShot = await piivGovernor.proposalSnapshot(proposalId);
      const proposalDeadline = await piivGovernor.proposalDeadline(proposalId);
      expect(proposalDeadline - proposalSnapShot).to.equal(50400); // 1 week

      /** @dev Pending Proposal state 0 */
      const proposalState = await piivGovernor.state(proposalId);
      expect(proposalState).to.equal(0);

      /** @dev Move forward to voting period */
      await moveBlocks(2);

      /** @dev Active Proposal state 1 */
      const proposalStateAfter = await piivGovernor.state(proposalId);
      expect(proposalStateAfter).to.equal(1);
    });

    it("Should vote", async function () {
      const { piivGovernor, proposalId } = await loadFixture(proposeFixture);
      await moveBlocks(2);

      /** @dev Vote for */
      const voteWay = 1;
      const voteTx = await piivGovernor.castVoteWithReason(
        proposalId,
        voteWay,
        "Vote Reason"
      );
      await voteTx.wait(1);
      await moveBlocks(2);
    });

    it("Should queue and execute", async function () {
      const { piivGovernor, proposalId, piivIssuer, otherAccount } =
        await loadFixture(proposeFixture);
      await moveBlocks(2);

      const encodedFunctionCall = piivIssuer.interface.encodeFunctionData(
        "addIssuer",
        [
          otherAccount.address,
          "did:idk:123",
          "Issuer Name",
          "Issuer Description",
          "cid:123",
        ]
      );

      /** @dev Vote for */
      const voteWay = 1;
      const voteTx = await piivGovernor.castVoteWithReason(
        proposalId,
        voteWay,
        "Vote Reason"
      );
      await voteTx.wait(1);
      await moveBlocks(2);

      expect(await piivGovernor.state(proposalId)).to.equal(1);
      // const period = await piivGovernor.votingPeriod();
      // console.log("period", period.toString());

      // const descriptionHash = ethers.keccak256(
      //   ethers.toUtf8Bytes(constants.PROPOSAL_DESCRIPTION)
      // );
      // const queueTx = await piivGovernor.queue(
      //   [await piivIssuer.getAddress()],
      //   [0],
      //   [encodedFunctionCall],
      //   descriptionHash
      // );
      // await queueTx.wait(1);
      // await moveTime(constants.MIN_DELAY + 1);

      // /** @dev Finished Proposal state 4 */
      // expect(await piivGovernor.state(proposalId)).to.equal(4);
    });
  });
});
