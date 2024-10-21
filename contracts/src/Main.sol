// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
  event CollectionCreated(string collectionName, address collectionAddress);

  mapping(string => Collection) private collections;

  constructor() Ownable(msg.sender) {}

  function createCollection(string calldata _name) external onlyOwner {
    Collection newCollection = new Collection(_name);
    collections[_name] = newCollection;
    emit CollectionCreated(_name, address(newCollection));
  }

  function addCard(
    string memory _setName,
    string memory _cardName,
    string memory _imgURL
  ) public onlyOwner {
    require(
      address(collections[_setName]) != address(0),
      "Collection does not exist"
    );
    collections[_setName].addCard(_cardName, _imgURL);
  }

  function mintCardToUser(
    string memory _collectionName,
    address recipient,
    uint256 cardId
  ) public onlyOwner {
    require(
      address(collections[_collectionName]) != address(0),
      "Collection does not exist"
    );
    collections[_collectionName].mintCard(recipient, cardId);
  }

  function mintMultipleCardsToUser(
    string memory _collectionName,
    address _to,
    uint256[] memory cardIds
  ) public onlyOwner {
    require(
      address(collections[_collectionName]) != address(0),
      "Collection does not exist"
    );
    for (uint256 i = 0; i < cardIds.length; i++) {
      collections[_collectionName].mintCard(_to, cardIds[i]);
    }
  }
}
