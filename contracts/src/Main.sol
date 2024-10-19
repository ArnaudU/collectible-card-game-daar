// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main {
  mapping(string => Collection) private collections;

  function createCollection(string calldata name) external {
    collections[name] = new Collection(name);
  }

  function _addCard(
    string memory _setName,
    string memory _cardName,
    string memory _imgURL
  ) public {
    collections[_setName].addCard(_cardName, _imgURL);
  }

  function mintCardToUser(
    string memory collectionName,
    address recipient,
    uint256 cardId
  ) public {
    collections[collectionName].mintCard(recipient, cardId);
  }
}
