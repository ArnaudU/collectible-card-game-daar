// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collection is ERC721 {
  struct Card {
    string cardName;
    string id;
    address owner;
    string imgURL;
  }

  event MintCard(address indexed to, uint256 indexed cardNumber);

  string public collectionName;
  Card[] public cards;
  bool public isBooster;
  uint256[] public cardAdress;
  Card[] public minted;

  constructor(string memory _name) ERC721(_name, "PKMN") {
    collectionName = _name;
    isBooster = true;
  }

  function addCard(Card memory carte) external {
    uint256 id = cards.length; // Récupérer l'index du nouvel élément
    cards.push(carte); // Ajouter la carte dans le tableau
    cardAdress.push(id); // Ajouter l'id de la carte dans le tableau des adresses de cartes
  }

  function mintCard(address _to, uint256 _cardNumber) external {
    Card memory original = cards[_cardNumber];
    Card memory cardCopy = Card(original.cardName, original.id, _to, original.imgURL);
    minted.push(cardCopy);
    _safeMint(_to, minted.length);
    emit MintCard(_to, minted.length - 1);
  }

  function getCards() public view returns (Card[] memory) {
    return cards;
  }

  function getMinted() public view returns (Card[] memory) {
    return minted;
  }

  function openBooster(address _buyer) public {
    require(isBooster, "Not a booster anymore");
    for (uint256 i = 0; i < cardAdress.length; i++) {
      this.mintCard(
        _buyer,
        uint(keccak256(abi.encodePacked(collectionName))) + cardAdress[i]
      );
    }
    isBooster = false;
  }

  function checkIfBooster() public view returns (bool) {
    return isBooster;
  }
}
