// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Collection is ERC721Enumerable, Ownable {
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
  mapping(uint256 => Card) cardToOwner;

  constructor(string memory _name) ERC721(_name, "PKMN") Ownable(msg.sender) {
    collectionName = _name;
    isBooster = true;
  }

  function addCard(
    string memory _name,
    string memory _id,
    string memory _imgURL
  ) external onlyOwner {
    Card memory carte = Card(_name, _id, address(0), _imgURL);
    uint256 id = cards.length; // Récupérer l'index du nouvel élément
    cards.push(carte); // Ajouter la carte dans le tableau
    cardToOwner[id] = carte; // Associer la carte à son id dans le mapping
    cardAdress.push(id); // Ajouter l'id de la carte dans le tableau des adresses de cartes
  }

  function mintCard(address _to, uint256 _cardNumber) external {
    require(_cardNumber < cards.length, "Invalid card number");
    _safeMint(_to, _cardNumber);
    cardToOwner[_cardNumber].owner = _to;
    emit MintCard(_to, _cardNumber);
  }

  function getCards() public view returns (Card[] memory) {
    return cards;
  }

  function openBooster(address _buyer) public {
    require(isBooster == true);
    for (uint256 i = 0; i < cardAdress.length; i++) {
      this.mintCard(_buyer, cardAdress[i]);
    }
    isBooster = false;
  }

  function checkIfBooster() public view returns (bool) {
    return isBooster;
  }

  function tokenURI(
    uint256 _tokenId
  ) public view override returns (string memory) {
    require(_tokenId < cards.length, "Nonexistent token");
    return cards[_tokenId].imgURL;
  }
}
