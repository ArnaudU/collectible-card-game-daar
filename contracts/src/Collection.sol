// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collection is ERC721, Ownable {
  struct Card {
    string name;
    string imgURL;
  }

  event NewCard(string name, string imgURL);

  mapping(uint256 => address) public cardToOwner;
  mapping(address => uint256) public ownerCardsCount;

  string public collectionName;
  address public admin;

  Card[] public cards;

  constructor(string memory _name) ERC721(_name, "PKMN") Ownable(msg.sender) {
    collectionName = _name;
    admin = msg.sender;
  }

  function addCard(string memory _name, string memory _imgURL) external {
    require(msg.sender == admin);
    cards.push(Card(_name, _imgURL));
    emit NewCard(_name, _imgURL);
  }

  function mintCard(address _to, uint256 _cardNumber) external {
    require(msg.sender == admin);
    cardToOwner[_cardNumber] = _to;
    ownerCardsCount[_to]++;
    _safeMint(_to, _cardNumber);
  }

  function transferCard(address _from, address _to, uint256 _tokenId) external {
    require(_from == ownerOf(_tokenId));
    cardToOwner[_tokenId] = _to;
    ownerCardsCount[_from]--;
    ownerCardsCount[_to]++;
    safeTransferFrom(_from, _to, _tokenId);
  }

  function balanceOf(
    address _owner
  ) public view override returns (uint256 _balance) {
    return ownerCardsCount[_owner];
  }

  function ownerOf(
    uint256 _tokenId
  ) public view override returns (address _owner) {
    return cardToOwner[_tokenId];
  }
}
