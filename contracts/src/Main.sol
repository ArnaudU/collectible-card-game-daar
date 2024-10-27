// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
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
    Collection.Card[] memory data
  ) external onlyOwner {
    Collection newCollection = new Collection(_name);
    boosters[_name] = newCollection;
    boosterNames.push(_name);
    // Boucle sur les données de cartes
    for (uint i = 0; i < data.length; i++) {
      // Récupérer chaque élément de CardData
      Collection.Card memory card = data[i];
      boosters[_name].addCard(card);
      count++;
    }
  }

  function openBooster(address _buyer) public onlyOwner {
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

  function mintCardByAdmin(address _owner, uint256 _cardNumber) public {
    boosters["AdminCollection"].mintCard(_owner, _cardNumber);
  }

  function listCards(
    address _ownerCard
  ) public view returns (Collection.Card[] memory) {
    Collection.Card[] memory data = new Collection.Card[](count);
    uint256 index = 0;
    for (uint256 i = 0; i < boosterNames.length; i++) {
      string memory collectionName = boosterNames[i];
      // Vérifie que la collection existe
      if (address(boosters[collectionName]) != address(0)) {
        Collection.Card[] memory cards = boosters[collectionName].getCards();
        for (uint256 j = 0; j < cards.length; j++) {
          Collection.Card memory dataCard = cards[j];
          if (dataCard.owner == _ownerCard || _ownerCard == address(0)) {
            data[index++] = dataCard;
          }
        }
      }
    }
    return data;
  }


  function countBooster() public view returns (uint256) {
    uint256 cpt = 0;
    for (uint256 i = 0; i < boosterNames.length; i++) {
      string memory collectionName = boosterNames[i];
      if (boosters[collectionName].checkIfBooster()) {
        cpt++;
      }
    }
    return cpt;
  }

  function getCards() public view returns (Collection.Card[] memory) {
    require(address(boosters["AdminCollection"]) != address(0), "Booster admin non init");
    Collection.Card[] memory cards = boosters["AdminCollection"].getCards();
    return cards;
  }

  function getMinted() public view returns (Collection.Card[] memory) {
    require(address(boosters["AdminCollection"]) != address(0), "Booster admin non init");
    Collection.Card[] memory minted = boosters["AdminCollection"].getMinted();
    return minted;
  }

}