// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
  event CollectionCreated(string collectionName, address collectionAddress);

  mapping(string => Collection) private collections;
  string[] internal collectionNames;
  int private count;
  struct CardData {
    string cardName;
    string id;
    address owner;
    string setName;
    string imgURL;
  }

  constructor() Ownable(msg.sender) {
    count = 1;
  }

  function createBooster(
    string calldata _name,
    bool _isBooster,
    CardData[] calldata data
  ) external onlyOwner {
    Collection newCollection = new Collection(_name, _isBooster);
    collections[_name] = newCollection;
    collectionNames.push(_name);
    // Boucle sur les données de cartes
    for (uint i = 0; i < data.length; i++) {
      // Récupérer chaque élément de CardData
      CardData memory card = data[i];
      collections[_name].addCard(card.cardName, card.setName, card.imgURL);
    }
  }

  function addCard(
    string memory _cardName,
    string memory _setName,
    string memory _imgURL
  ) public onlyOwner {
    require(
      address(collections[_setName]) != address(0),
      "Collection does not exist"
    );
    collections[_setName].addCard(_cardName, _setName, _imgURL);
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

  // Fonction pour obtenir le nombre total de cartes possédées par une adresse dans toutes les collections
  function balanceOf(address ownerAddress) public view returns (uint256) {
    uint256 totalBalance = 0;

    // Boucle sur chaque collection dans le tableau collectionNames
    for (uint256 i = 0; i < collectionNames.length; i++) {
      string memory collectionName = collectionNames[i];

      // Vérifie que la collection existe
      if (address(collections[collectionName]) != address(0)) {
        // Ajoute le balanceOf de cette collection au total
        totalBalance += collections[collectionName].balanceOf(ownerAddress);
      }
    }
    return totalBalance;
  }
}
