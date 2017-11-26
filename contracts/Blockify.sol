pragma solidity ^0.4.4;

contract Blockify {
	struct Song {
		uint bans;
	}

	// address of deployer
	address public owner;

	// cost to ban
	uint public banCost;

	// additional cost to add a song per vote
	uint public banModifier;

	// base cost to add a song
	uint public baseAddCost;

	// mapping of Spotify URIs to Songs
	mapping(bytes32 => Song) public songs;

	// fired when a song is added
	event SongQueued(address by, uint amount, bytes32 spotifyURI);

	function Blockify() public {
		owner = msg.sender;
		banCost = 100;
		banModifier = 100;
		baseAddCost = 100;
	}

	function requestSong(bytes32 spotifyURI) public payable {
		Song storage song = songs[spotifyURI];
		require(msg.value >= baseAddCost + banModifier * song.bans);
		SongQueued(msg.sender, msg.value, spotifyURI);
	}

	function banSong(bytes32 spotifyURI) public payable {
		require(msg.value > banCost);
		songs[spotifyURI].bans++;
	}

	function getSong(bytes32 spotifyURI) public constant returns(uint, uint) {
		uint requestCost = baseAddCost + banModifier * songs[spotifyURI].bans;
		return (songs[spotifyURI].bans, requestCost);
	}

	function getBanPrice() public constant returns(uint) {
		return banCost;
	}
}
