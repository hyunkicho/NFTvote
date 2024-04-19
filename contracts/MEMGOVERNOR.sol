// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract MEMGOVERNOR is Governor, GovernorCountingSimple, GovernorVotes {
    constructor(IVotes _token)
        Governor("MEMGOVERNOR")
        GovernorVotes(_token)
    {}

    function votingDelay() public view override returns (uint256) {
        return 60; // 9 block to snap shot
    }

    function votingPeriod() public view override returns (uint256) {
        return 60; // 60 block to vote
    }

    // // The following functions are overrides required by Solidity.
    /**
     * @dev Returns the quorum for a block number, in terms of number of votes: `supply * numerator / denominator`.
     */
    function quorum(uint256 blockNumber) public view virtual override returns (uint256) {
        return 3;
    }

    function quorumReached(uint256 proposalId) public view returns (bool){
        return _quorumReached(proposalId);
    }

    function voteSucceeded(uint256 proposalId) public view returns (bool){
        return _voteSucceeded(proposalId);
    }

}