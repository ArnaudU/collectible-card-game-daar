// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Collection is ERC721Enumerable, Ownable {
  struct Card {
    string name;
    string setName;
    string imgURL;
    address owner;
  }

  event NewCard(string name, string setName, string imgURL);
  event MintCard(address indexed to, uint256 indexed cardNumber);

  string public collectionName;
  Card[] public cards;
  bool public isBooster;

  constructor(
    string memory _name,
    bool _isBooster
  ) ERC721(_name, "PKMN") Ownable(msg.sender) {
    collectionName = _name;
    isBooster = _isBooster;
  }

  function addCard(
    string memory _name,
    string memory _setName,
    string memory _imgURL
  ) external onlyOwner {
    cards.push(Card(_name, _setName, _imgURL, address(0)));
    emit NewCard(_name, _setName, _imgURL);
  }

  function mintCard(address _to, uint256 _cardNumber) external onlyOwner {
    require(_cardNumber < cards.length, "Invalid card number");
    _safeMint(_to, _cardNumber);
    emit MintCard(_to, _cardNumber);
  }

  function tokenURI(
    uint256 _tokenId
  ) public view override returns (string memory) {
    require(_tokenId < cards.length, "Nonexistent token");
    return cards[_tokenId].imgURL;
  }
}
