// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";

contract PiivGovToken is ERC20Votes, ZKPVerifier {
    uint256 public constant s_maxSupply = 1000000000000000000000000;
    uint256 public constant TOKEN_AMOUNT_FOR_AIRDROP_PER_ID = 100000000000;
    // POLYGON ID STUFF 1
    uint64 public constant TRANSFER_REQUEST_ID = 1;

    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    constructor() ERC20("PiivGovToken", "PIIVGT") ERC20Permit("PiivGovToken") {
        _mint(msg.sender, s_maxSupply);
    }

    /*
     * @dev Below functions are overrides required by Solidity.
     */

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(
        address account,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._burn(account, amount);
    }

    // POLYGON ID STUFF 2
    function _beforeProofSubmit(
        uint64 /* requestId */,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that the challenge input of the proof is equal to the msg.sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in the proof is not a sender address"
        );
    }

    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        uint256 id = inputs[validator.getChallengeInputIndex()];
        // execute the airdrop
        if (idToAddress[id] == address(0)) {
            _mint(_msgSender(), TOKEN_AMOUNT_FOR_AIRDROP_PER_ID);
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
    }
}
