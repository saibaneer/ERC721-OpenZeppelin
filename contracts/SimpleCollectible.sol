// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract SimpleCollectible is ERC721{

  uint256 public tokenCounter;
  uint8 public maximumTokens;
  uint8 onlyOnce;
  address public owner;

  // Optional mapping for token URIs
  mapping(uint256 => string) private _tokenURIs;

  constructor() public ERC721("KillerRick","RIK") {
    tokenCounter = 0;
    onlyOnce = 0;
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "You are not authorized");
    _;
  }

  function setMaximumTokens(uint8 _max) external onlyOwner {
    require(onlyOnce == 0, "Function can only be called once");
    onlyOnce++;
    maximumTokens = _max;
  }

  function _setTokenURI(uint256 _newItemId, string memory _tokenURI) internal {
    require(_exists(_newItemId), "RIK token with this Id doesnt exist");
    _tokenURIs[_newItemId] = _tokenURI;
  }

  function createCollectible(string memory tokenURI) public returns(uint256) {
    require(maximumTokens > 0, "Maximum tokens have not been set");
    require(tokenCounter < maximumTokens, "You cannot mint anymore tokens");

    tokenCounter = tokenCounter + 1;
    uint256 newItemId = tokenCounter;
    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    
    return newItemId;
  }
}
