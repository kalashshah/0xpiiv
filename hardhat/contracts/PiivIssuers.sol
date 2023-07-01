// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

error PiivIssuers__InvalidIssuerAddress();
error PiivIssuers__IssuerAlreadyExists(address issuer);
error PiivIssuers__IssuerDoesNotExist(address issuer);
error PiivIssuers__InvalidName();
error PiivIssuers__InvalidDescription();
error PiivIssuers__InvalidCid();
error PiivIssuers__InvalidDid();

struct IssuerData {
    address issuer;
    string did;
    string name;
    string description;
    string cid;
}

contract PiivIssuers is Ownable {
    mapping(address => IssuerData) private issuers;

    event IssuerAdded(
        address indexed issuer,
        string did,
        string name,
        string description,
        string cid
    );

    event IssuerRemoved(address indexed issuer);

    function addIssuer(
        address issuer,
        string memory did,
        string memory name,
        string memory description,
        string memory cid
    ) external onlyOwner {
        if (issuer == address(0)) {
            revert PiivIssuers__InvalidIssuerAddress();
        }

        if (bytes(name).length == 0) {
            revert PiivIssuers__InvalidName();
        }

        if (bytes(description).length == 0) {
            revert PiivIssuers__InvalidDescription();
        }

        if (bytes(cid).length == 0) {
            revert PiivIssuers__InvalidCid();
        }

        if (bytes(issuers[issuer].did).length != 0) {
            revert PiivIssuers__IssuerAlreadyExists(issuer);
        }

        issuers[issuer] = IssuerData({
            issuer: issuer,
            did: did,
            name: name,
            description: description,
            cid: cid
        });

        emit IssuerAdded(issuer, did, name, description, cid);
    }

    function removeIssuer(address issuer) external onlyOwner {
        if (bytes(issuers[issuer].did).length == 0) {
            revert PiivIssuers__IssuerDoesNotExist(issuer);
        }

        delete issuers[issuer];

        emit IssuerRemoved(issuer);
    }
}
