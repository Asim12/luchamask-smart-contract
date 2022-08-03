//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MockToken is ERC20{
    constructor(string memory name, string memory symbol) ERC20(name, symbol){
        _mint(msg.sender, (1000000000000)*10**18);
    }
    function requestMockTokens() public {
        _mint(msg.sender, (500)*10**18);
    }
}