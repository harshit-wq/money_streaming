//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "./interface.sol";

contract moneyStreaming {
    uint256 private rate;
    address private recipient;
    address private token;
    uint256 private startTime;
    uint256 private endTime;
    uint256 private referenceTime;
    uint256 private coolDownTime;

    constructor(address _recipient, address _token, uint256 _amount,  uint256 _startTime, uint256 _endTime, uint256 _coolDownTime) {
        recipient = _recipient;
        token = _token;
        rate = calculateRate(_amount, _startTime, _endTime);
        startTime = _startTime;
        endTime = _endTime;
        referenceTime = startTime;
        coolDownTime = _coolDownTime;
    }

    function calculateRate(uint256 _amount, uint256 _startTime, uint256 _endTime) public pure returns (uint256)  {
        uint256 Rate = _amount / (_endTime - _startTime); // check this
        return Rate;
    }

    function claimableAmount() public view returns (uint256) {
        require(block.timestamp >= coolDownTime, "You cannot withdraw funds before cool down time");
        uint256 amountClaimable = rate * (block.timestamp - referenceTime); //check this
        return amountClaimable;
    }

    function collect() public {
        uint256 transferAmount = claimableAmount();
        IERC20_functions asset = IERC20_functions(token);
        asset.transfer(recipient, transferAmount);
        referenceTime = block.timestamp;
    }
}
