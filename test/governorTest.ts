/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

// chai.use(solidity);

const name = 'MyNFT';
const symbol = 'MNFT';
const decimals = 18;
// const tokenURI = 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/erc721/metadata/';
function changeToBigInt(amount: number) {
  const answerBigint = ethers.utils.parseUnits(amount.toString(), decimals);
  return answerBigint;
}

describe('Start Example ERC721 Governor test', async () => {
  // contracts
  let exampleERC721: Contract;
  let exampleERC20_1: Contract;
  let exampleERC20_2: Contract;
  let exampleERC20_3: Contract;
  let erc20Token1: Contract;
  let erc20Token2: Contract;
  let erc20Token3: Contract;


  let governor: Contract;
  //signers
  let owner: SignerWithAddress;
  let voter1: SignerWithAddress;
  let voter2: SignerWithAddress;
  let voter3: SignerWithAddress;
  let voter4: SignerWithAddress;
  let teamAddr: SignerWithAddress;
  let propoasl1Id: number;
  let transferCalldata: string;

  it('Set data for exampleERC721 Governor test', async () => {
    [owner, voter1, voter2, voter3, voter4, teamAddr] = await ethers.getSigners(); // get a test address
  });

  describe('Test Example exampleERC721 Governor deployment', () => {
    it('Should get correct name, symbol, decimal for the Example ERC721 Contract', async () => {

      console.log('deploying MEME20 contract')
      const ERC20 = await ethers.getContractFactory("MEME20");
      exampleERC20_1 = await ERC20.deploy();
      exampleERC20_2 = await ERC20.deploy();
      exampleERC20_3 = await ERC20.deploy();

      await exampleERC20_1.deployed();
      await exampleERC20_2.deployed();
      await exampleERC20_3.deployed();

      console.log('deploying WOWFRIENDS contract');
      const ERC721vote = await ethers.getContractFactory("WOWFRIENDS");
      exampleERC721 = await ERC721vote.deploy();
      await exampleERC721.deployed();
      await exampleERC721.mint(voter1.address);
      await exampleERC721.mint(voter2.address);
      await exampleERC721.mint(voter3.address);
      await exampleERC721.mint(voter4.address);

      // expect(await exampleERC721.name()).to.equal(name);
      // expect(await exampleERC721.symbol()).to.equal(symbol);
      console.log(`erc721vote contract is deployed to ${exampleERC721.address}`);
      console.log('tokenURI >>',await exampleERC721.tokenURI(0));
      console.log('deploying governance contract')
      const Governor = await ethers.getContractFactory("MEMGOVERNOR");
      governor = await Governor.deploy(exampleERC721.address);
      await governor.deployed();

      // expect(await governor.votingDelay()).to.equal(1);
      // expect(await governor.votingPeriod()).to.equal(20);
      console.log(`governor contract is deployed to ${governor.address}`);
    });

    it('step 01) set proposal action', async () => {
      let currentBlockNumber = await ethers.provider.getBlockNumber();
      console.log("proposal currentBlockNumber is : ", currentBlockNumber);
      erc20Token1 = await ethers.getContractAt("MEME20", exampleERC20_1.address);
      console.log("exampleERC20.address : " , erc20Token1.address);

      await erc20Token1.approve(governor.address, changeToBigInt(100000000));

      erc20Token2 = await ethers.getContractAt("MEME20", exampleERC20_1.address);
      console.log("exampleERC20.address : " , erc20Token2.address);

      erc20Token3 = await ethers.getContractAt("MEME20", exampleERC20_1.address);
      console.log("exampleERC20.address : " , erc20Token3.address);
      //set Proposal to send token
      let teamAddress = teamAddr.address;
      console.log("team address :", teamAddress)
      // const grantAmount = 1000;
      // await erc20Token1.mint(governor.address, changeToBigInt(grantAmount))
      // await erc20Token2.mint(governor.address, changeToBigInt(grantAmount))
      // await erc20Token3.mint(governor.address, changeToBigInt(grantAmount))

      transferCalldata = erc20Token1.interface.encodeFunctionData("multiTransfer", [[voter1.address, voter2.address, voter3.address, voter4.address], [changeToBigInt(1),changeToBigInt(1),changeToBigInt(1),changeToBigInt(1)]]);
      console.log("transferCalldata :", transferCalldata)

      let proporsalId = await governor.callStatic.propose(
        [erc20Token1.address],
        [0],
        [transferCalldata],
        "Proposal #1: participate launch for team"
      )
      console.log("proporsalId is : ", proporsalId);
      //proposal을 해시한 값이 아이디로 나오게 된다.
      //값을 미리 받아온 후 실행, 실제로는 이벤트를 불러와서 체크할 수 있다.
      await governor.propose(
        [erc20Token1.address],
        [0],
        [transferCalldata],
        "Proposal #1: participate launch for team"
      )
      const stateOfProposal = await governor.state(proporsalId.toString())
      console.log("stateOfProposal is : ", stateOfProposal);
      propoasl1Id = proporsalId;
    });

    it('step 02) check get Votes', async () => {  
      const currentBlockNumber = await ethers.provider.getBlockNumber();
      expect(await governor.getVotes(voter1.address, currentBlockNumber-1)).to.equal('0');
      expect(await governor.getVotes(voter2.address, currentBlockNumber-1)).to.equal('0');
      expect(await governor.getVotes(voter3.address, currentBlockNumber-1)).to.equal('0');
      expect(await governor.getVotes(voter4.address, currentBlockNumber-1)).to.equal('0');
    });

    it('step 03) get nft and check Votes again', async () => {
      console.log("step 01 👉 : mint erc721 ") 
      await exampleERC721.mint(voter1.address)
      // expect(await exampleERC721.balanceOf(voter1.address)).to.equal(BN('1'));
      await exampleERC721.mint(voter2.address)
      // expect(await exampleERC721.balanceOf(voter2.address)).to.equal('1');
      await exampleERC721.mint(voter3.address)
      // expect(await exampleERC721.balanceOf(voter3.address)).to.equal('1');
      await exampleERC721.mint(voter4.address)
      // expect(await exampleERC721.balanceOf(voter4.address)).to.equal('1');

      console.log("step 02 👉 : delgate from erc721 ") 
      await exampleERC721.connect(voter1).delegate(voter1.address)
      await exampleERC721.connect(voter2).delegate(voter2.address)
      await exampleERC721.connect(voter3).delegate(voter3.address)
      await exampleERC721.connect(voter4).delegate(voter4.address)
      const currentBlockNumber = await ethers.provider.getBlockNumber();
      console.log("currentBlockNumber : ", currentBlockNumber)

      await ethers.provider.send("evm_mine", []); //mine to start vote
      console.log("step 03 👉 : check getPastVotes from erc721 ") 
      // expect(await exampleERC721.getPastVotes(voter1.address, currentBlockNumber)).to.equal('1');
      // expect(await exampleERC721.getPastVotes(voter2.address, currentBlockNumber)).to.equal('1');
      // expect(await exampleERC721.getPastVotes(voter3.address, currentBlockNumber)).to.equal('1');
      // expect(await exampleERC721.getPastVotes(voter4.address, currentBlockNumber)).to.equal('1');
      
      console.log("step 04 👉 : check getVotes from governor ") 
      // expect(await governor.getVotes(voter1.address, currentBlockNumber)).to.equal('1');
      // expect(await governor.getVotes(voter2.address, currentBlockNumber)).to.equal('1');
      // expect(await governor.getVotes(voter3.address, currentBlockNumber)).to.equal('1');
      // expect(await governor.getVotes(voter4.address, currentBlockNumber)).to.equal('1');

      const stateOfProposal = await governor.state(propoasl1Id.toString())
      console.log("stateOfProposal is : ", stateOfProposal);
    });

    it('step 04) castVote action', async () => {  
      console.log("proposal snap shot : ", await governor.proposalSnapshot(propoasl1Id))
      console.log("proposal deadline : ", await governor.proposalDeadline(propoasl1Id))
      let currentBlockNumber = await ethers.provider.getBlockNumber();
      console.log("currentBlockNumber : ", currentBlockNumber)

      await ethers.provider.send("evm_mine", []); //mine to start vote

      currentBlockNumber = await ethers.provider.getBlockNumber();
      console.log("currentBlockNumber : ", currentBlockNumber)

      await governor.connect(voter1).castVote(propoasl1Id.toString(),1) //1 is FOR 0 is Against

      await governor.connect(voter2).castVote(propoasl1Id.toString(),1) //1 is FOR 0 is Against

      let  hasVoted = await governor.hasVoted(propoasl1Id.toString(), voter2.address)
      console.log("hasVoted is : ", hasVoted);

      await governor.connect(voter3).castVote(propoasl1Id.toString(),1) //1 is FOR 0 is Against
      hasVoted = await governor.hasVoted(propoasl1Id.toString(), voter3.address)
      console.log("hasVoted is : ", hasVoted);

      await governor.connect(voter4).castVote(propoasl1Id.toString() ,1) //1 is FOR 0 is Against
      hasVoted = await governor.hasVoted(propoasl1Id.toString(), voter4.address)
      console.log("hasVoted is : ", hasVoted);

      const deadline = await governor.proposalDeadline(propoasl1Id.toString())
      console.log("deadline is ", deadline)

      let stateOfProposal = await governor.state(propoasl1Id.toString())
      console.log("stateOfProposal is : ", stateOfProposal);

      currentBlockNumber = await ethers.provider.getBlockNumber();
      console.log("currentBlockNumber is : ", currentBlockNumber);
      
      await ethers.provider.send("evm_mine", []); //mine to start vote
      await ethers.provider.send("evm_mine", []); //mine to start vote
      await ethers.provider.send("evm_mine", []); //mine to start vote
      await ethers.provider.send("evm_mine", []); //mine to start vote
      await ethers.provider.send("evm_mine", []); //mine to start vote
      currentBlockNumber = await ethers.provider.getBlockNumber();
      console.log("currentBlockNumber is : ", currentBlockNumber);
      const quorum = await governor.quorum(currentBlockNumber)
      console.log("qurom :", quorum)
      stateOfProposal = await governor.state(propoasl1Id.toString())
      console.log("stateOfProposal is : ", stateOfProposal);
      let quorumReached = await governor.quorumReached(propoasl1Id.toString())
      console.log("quorumReached is : ", quorumReached);
      let proposalVotes = await governor.proposalVotes(propoasl1Id.toString())
      console.log("proposalVotes is : ", proposalVotes);
      let voteSucceeded = await governor.voteSucceeded(propoasl1Id.toString())
      console.log("voteSucceeded is : ", voteSucceeded);

      for(let i=0; i<100; i++) {
        await ethers.provider.send("evm_mine", []); //mine to start vote
      }

      const descriptionHash = ethers.utils.id("Proposal #1: participate launch for team");
      await governor.execute(
        [erc20Token1.address],
        [0],
        [transferCalldata],
        descriptionHash,
      );
    });
  });

});