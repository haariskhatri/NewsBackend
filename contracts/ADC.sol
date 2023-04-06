//SPDX-License-Identifier:MIT 


pragma solidity 0.8.18;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract ADC is ERC20, ERC20Burnable, Ownable {


  
  constructor() ERC20("DigiRupee", "DNR") {
    _mint(msg.sender, 1000 * 10 ** decimals());
    _mint(0xE4125D0886F2578D9788cb14c661d00bD62fC9E9, 1000 * 10 ** decimals());
    _mint(0xC763131e6aF9c4220ef96AE3070a330f71D586cf, 1000 * 10 ** decimals());
   }

  function mint(uint256 amount) external 
  {
        _mint(msg.sender, amount * 10**uint(decimals()));
  }


}