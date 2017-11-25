pragma solidity ^0.4.4;

contract Blockify {
	struct Song {
		bytes32 spotifyURI;
		int8 vote;
	}

	// address of deployer
	address public owner;

	// eth cost to vote
	uint public voteUnitCost;

	// additional cost to add a song per vote
	uint public voteCostModifier;

	// base cost to add a song
	uint public baseAddCost;

	// mapping of Spotify URIs to Songs
	mapping(bytes32 => Song) public songs;

	// fired when a song is added
	event SongQueued(address by, uint amount, bytes32 spotifyURI);

	function Blockify() public {
		owner = msg.sender;
		voteUnitCost = 100;
		voteCostModifier = 100;
		baseAddCost = 100;
	}

	function queueSong(bytes32 spotifyURI) public payable {
		//
	}

	function voteSong(bytes32 spotifyURL, int8 vote) public payable {

	}
}
