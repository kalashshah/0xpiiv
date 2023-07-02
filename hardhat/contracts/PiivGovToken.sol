// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract PiivGovToken is ERC20Votes {
    uint256 public constant s_maxSupply = 1000000000000000000000000;

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
}
