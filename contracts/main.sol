//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MoneyStreaming {
    using SafeERC20 for IERC20;
    using SafeMath for uint;

    uint256 rate;
    address creator;
    address recipient;
    address token;
    uint256 amount;
    uint256 startTime;
    uint256 endTime;
    uint256 referenceTime;
    uint256 coolDownTime;
    bool streaming = false;

    struct parameters{
        address _creator;
        address _recipient;
        address _token;
        uint256 _amount;
        uint256 _startTime;
        uint256 _endTime;
        uint256 _coolDownTime;
    }

    constructor(parameters memory input) payable {
        require(input._startTime>=block.timestamp, "The contract should start in future");
        require(input._startTime<input._endTime, "The endTime should be greater than startTime");
        require(input._coolDownTime>=startTime, "The coolDownTime should be greater than or equal to startTime");
        require(input._coolDownTime<=input._endTime, "The coolDownTime should be smaller than or equal to endTime");
        
        creator = input._creator;
        recipient = input._recipient;
        token = input._token;
        amount = input._amount;
        rate = calculateRate(input._amount, input._startTime, input._endTime);
        startTime = input._startTime;
        endTime = input._endTime;
        referenceTime = input._startTime;
        coolDownTime = input._coolDownTime;
    }

    function startStreaming() public {
        IERC20 asset = IERC20(token);
        asset.safeTransferFrom(msg.sender, address(this), amount);
        streaming=true;
    }

    function calculateRate(uint256 _amount, uint256 _startTime, uint256 _endTime) public pure returns (uint256)  {
        uint256 Rate = SafeMath.div(_amount, (_endTime - _startTime)); // check this
        return Rate;
    }

    function claimableAmount() public view returns (uint256) {
        require(streaming == true, "Start the streaming first using startStreaming() function");
        require(block.timestamp >= coolDownTime, "You cannot withdraw funds before cool down time");
        uint256 amountClaimable;
        if(block.timestamp>=endTime){
            amountClaimable = SafeMath.mul(rate, (endTime - referenceTime));
        }else{
            amountClaimable = SafeMath.mul(rate, SafeMath.sub(block.timestamp, referenceTime)); //check this
        }
        return amountClaimable;
    }

    function collect() public returns (uint256){
        require(streaming == true, "Start the streaming first using startStreaming() function");
        uint256 transferAmount = claimableAmount();
        IERC20 asset = IERC20(token);
        asset.safeTransfer(recipient, transferAmount);
        referenceTime = block.timestamp;
        return transferAmount;
    }
}
