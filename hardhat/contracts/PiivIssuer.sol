// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

error PiivIssuer__InvalidIssuerAddress();
error PiivIssuer__IssuerAlreadyExists(address issuer);
error PiivIssuer__IssuerDoesNotExist(address issuer);
error PiivIssuer__InvalidName();
error PiivIssuer__InvalidDescription();
error PiivIssuer__InvalidCid();
error PiivIssuer__InvalidDid();

struct IssuerData {
    address issuer;
    string did;
    string name;
    string description;
    string cid;
}

contract PiivIssuer is Ownable {
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
            revert PiivIssuer__InvalidIssuerAddress();
        }

        if (bytes(name).length == 0) {
            revert PiivIssuer__InvalidName();
        }

        if (bytes(description).length == 0) {
            revert PiivIssuer__InvalidDescription();
        }

        if (bytes(cid).length == 0) {
            revert PiivIssuer__InvalidCid();
        }

        if (bytes(issuers[issuer].did).length != 0) {
            revert PiivIssuer__IssuerAlreadyExists(issuer);
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
            revert PiivIssuer__IssuerDoesNotExist(issuer);
        }

        delete issuers[issuer];

        emit IssuerRemoved(issuer);
    }
}
