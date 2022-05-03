const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MoneyStreaming", function () {

  let user1_coinbase1="0x71660c4005BA85c37ccec55d0C4493E66Fe775d3";
  let user1;
  let token;
  let greeter;
  const _creator = user1_coinbase1;
  const _recipient = "0x3Fc046bdE274Fe8Ed2a7Fd008cD9DEB2540dfE36";
  const _token = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const _amount = 500000000;
  const _startTime = Math.floor(Date.now() / 1000)
  const _endTime = _startTime + 5 * 60;
  const _coolDownTime = _startTime + 60;

  before(async()=> {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [user1_coinbase1],
    });
    user1=await ethers.getSigner(user1_coinbase1);
  
    token = await ethers.getContractAt("IERC20", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");

    const Greeter = await ethers.getContractFactory("MoneyStreaming");
    greeter = await Greeter.connect(user1).deploy([_creator,_recipient,_token,_amount,_startTime,_endTime,_coolDownTime]);
    await greeter.deployed();

  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  describe("tests", function(){
    it("deployment", async function () {
      console.log("USDC balance of contract :", (await token.balanceOf(greeter.address)).toString());
      console.log("USDC balance of recipient :", (await token.balanceOf(_recipient)).toString());
    });
  });

  describe("tests", function(){
    it("before starting contract", async function () {
      try {
        await greeter.collect();
      } catch (error) {
        console.log(error.message)
      }
      console.log("USDC balance of contract :", (await token.balanceOf(greeter.address)).toString());
      console.log("USDC balance of recipient :", (await token.balanceOf(_recipient)).toString());
    });
  });

  describe("tests", function(){
    it("after starting contract", async function () {
      await token.connect(user1).approve(greeter.address, _amount);
      await greeter.startStreaming();
      console.log("USDC balance of contract :", (await token.balanceOf(greeter.address)).toString());
      console.log("USDC balance of recipient :", (await token.balanceOf(_recipient)).toString());
    });
  });

  describe("tests", function(){
    it("collecting before coolDownTime", async function () {
      try {
        await greeter.collect();
      } catch (error) {
        console.log(error.message)
      }
      console.log("USDC balance of contract :", (await token.balanceOf(greeter.address)).toString());
      console.log("USDC balance of recipient :", (await token.balanceOf(_recipient)).toString());
    });
  });

  describe("tests", function(){
    it("collecting after coolDownTime", async function () {
      this.timeout(5000000);
      await sleep(3 * 60 * 1001);
      const x = await greeter.collect();
      console.log("USDC balane of contract :", (await token.balanceOf(greeter.address)).toString());
      console.log("USDC balance of recipient :", (await token.balanceOf(_recipient)).toString());
    });
  });

  describe("tests", function(){
    it("collecting after contract endTime", async function () {
      this.timeout(5000000);
      await sleep(6 * 60 * 1001);
      const x = await greeter.collect();
      console.log("USDC balane of contract :", (await token.balanceOf(greeter.address)).toString());
      console.log("USDC balance of recipient :", (await token.balanceOf(_recipient)).toString());
    });
  });

});
