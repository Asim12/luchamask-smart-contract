//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./RandomlyAssigned.sol";
import "hardhat/console.sol";
contract LuchaMaskRandom is ERC721, Ownable, RandomlyAssigned {
    uint256 public mintPrice;
    mapping(address => uint256) public minters;
    bool public isRevealed;
    address internal immutable TVKtoken;
    bool public canReserve;
    uint256 public mintLimit;
    uint256 public reservedTokens;
    bool public whiteListSale;
    bool public publicSale;
    string public  provenanceHash;
    mapping(address => bool) public whiteList;
    uint256 public  maxAmountTokensReserved;
    string public baseURI;
    bool internal baseURIsetted;
    string public placeholderURI;

    constructor(address _TVKtoken,uint256 _maxNftSupply,uint256 _maxAmountTokensReserved,string memory _placeholderURI,string memory _baseURI, string memory _provinanceHash, string memory _name, string memory _symbol ) ERC721(_name, _symbol) RandomlyAssigned(_maxNftSupply, 1) {
        require(_maxNftSupply > 0, "the maximum supply value cannot be less than 1 ");
        require(_maxAmountTokensReserved < _maxNftSupply, "you cannot reserved all nft");
        require(_TVKtoken != address(0), "Please provide valid TVK token address!");
        mintPrice = 0.06 * 10**18;
        TVKtoken = _TVKtoken;
        maxAmountTokensReserved = _maxAmountTokensReserved;
        placeholderURI = _placeholderURI;
        baseURI = _baseURI;
        provenanceHash = _provinanceHash;
        canReserve = true;
    }

    function reserveTokensToOwner(uint256 amount) external onlyOwner {
        require(amount <= maxAmountTokensReserved, "this tx will ran out of gas");
        require(canReserve,"Tokens cannot be reserved");
        require(tokenCount() + amount <= totalSupply(), "Reserve token cannot be more than total supply");
        require(reservedTokens + amount <= maxAmountTokensReserved, "Reserve tokens exceeding total allowed limit");
        for (uint256 i = 0; i < amount; i++) {
            uint256 id = nextToken();
            _safeMint(msg.sender, id);
        }
        reservedTokens += amount;
        if (reservedTokens >= maxAmountTokensReserved) {
            canReserve = false;
        }
    }

    function mintMask(uint256 amount) public payable {
        require(totalSupply()  >= tokenCount() + amount, "public limit is reached!");
        require(msg.value >= (mintPrice * amount), "Ether value sent is not enough");
        require(tokenCount() + amount <= totalSupply(), "Can't mint more than maximum supply" );
        require(whiteList[msg.sender] == true && whiteListSale == true || publicSale == true ,"You can not mint because minting is not start yet!");
        mintLimit = ((IERC20(TVKtoken).balanceOf(msg.sender) >= 500 * 10**18 ) || whiteList[msg.sender] == true) ? 5 : 3;
        require( (minters[msg.sender] + amount) <= mintLimit, ( (mintLimit - minters[msg.sender]) == 0) ? "Mint limit is already reached" : string(abi.encodePacked("You can mint ", Strings.toString( mintLimit - minters[msg.sender] ), " more tokens only") ));
        for (uint256 i = 1; i <= amount; i++) {
            uint256 id = nextToken();
            _safeMint(msg.sender, id);
        }
        minters[msg.sender] += amount;
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - (mintPrice));
        }    
    }

    function updateWhiteListSale(bool flag) public onlyOwner {
        whiteListSale = flag;
    }

    function updatePublicSale(bool flag) public onlyOwner {
        publicSale = flag;
    }

    function updateBaseURI(string memory _baseURI) public onlyOwner {
        require(bytes(_baseURI).length > 0 , "Baseuri can not be empty!");
        baseURI = _baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");
        return (isRevealed == true) ? string(abi.encodePacked(baseURI, Strings.toString(tokenId),".json"))  : placeholderURI ;
    }

    function addToWhiteList(address[] memory wallets) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            if(whiteList[wallets[i]] != true ){
                whiteList[wallets[i]] = true;
            }
        }
    }

    function setPlaceholderURI(string memory _placeholderURI) external onlyOwner {
        require(bytes(_placeholderURI).length > 0, "Placeholder URI cannot be empty.");
        placeholderURI = _placeholderURI;
    }
    
    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setBaseuriReveal(bool _isRevealed) external onlyOwner{
        isRevealed = _isRevealed;
    }

    receive() external payable {}

    fallback() external payable {}
}