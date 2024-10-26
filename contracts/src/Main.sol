// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
  struct CardData {
    string cardName;
    string id;
    string imgURL;
  }

  event CollectionCreated(string collectionName, address collectionAddress);

  mapping(string => Collection) private boosters;
  Collection private opened;
  string[] internal boosterNames;
  uint private count;
  uint256 public listingPrice = 1 ether;

  constructor() Ownable(msg.sender) {
    count = 0;
  }

  function createBoosters(
    string memory _name,
    CardData[] memory data
  ) external onlyOwner {
    Collection newCollection = new Collection(_name);
    boosters[_name] = newCollection;
    boosterNames.push(_name);
    // Boucle sur les données de cartes
    for (uint i = 0; i < data.length; i++) {
      // Récupérer chaque élément de CardData
      CardData memory card = data[i];
      boosters[_name].addCard(card.cardName, card.id, card.imgURL);
      count++;
    }
  }

  function openBooster(address _buyer) public {
    for (uint256 i = 0; i < boosterNames.length; i++) {
      string memory collectionName = boosterNames[i];
      // Vérifie que la collection existe
      Collection card = boosters[collectionName];
      if (card.checkIfBooster()) {
        card.openBooster(_buyer);
        break;
      }
    }
  }

  function listCards(address _owner) public view returns (CardData[] memory) {
    CardData[] memory data = new CardData[](count);
    uint256 index = 0;
    for (uint256 i = 0; i < boosterNames.length; i++) {
      string memory collectionName = boosterNames[i];
      // Vérifie que la collection existe
      if (address(boosters[collectionName]) != address(0)) {
        Collection.Card[] memory cards = boosters[collectionName].getCards();
        for (uint256 j = 0; j < cards.length; j++) {
          Collection.Card memory dataCard = cards[j];
          if (dataCard.owner == _ownerCard || _ownerCard == address(0)) {
            data[index++] = (
              CardData(dataCard.cardName, dataCard.id, dataCard.imgURL)
            );
          }
        }
      }
    }
    return data;
  }
}
