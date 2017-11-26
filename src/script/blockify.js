import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import BlockifyJSON from '../../dist/contracts/Blockify.json'
import Spotify from 'spotify-web-api-js'

class Blockify {
  constructor (spotifyToken) {
    // hack for using Web3 v1.0 with TruffleContract
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

    // initialise our Web3 instance
    if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      console.info('[Web3] Using browser Web3 provider')
      this.web3 = new Web3(window.web3.currentProvider)
    } else {
      console.info('[Web3] Using RPC Web3 provider (http://localhost:8545)')
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    }

    // initialise our contract reference
    this.contract = TruffleContract(BlockifyJSON)
    this.contract.setProvider(this.web3.currentProvider)
    this.contract.defaults({
      gas: 900000
    })

    // object for storing event handlers
    this._events = {}

    // Spotify web API
    this.spotify = new Spotify()
    this.spotify.setAccessToken(spotifyToken)

    // Contract event listeners
    this.contract.deployed().then(instance => {
      console.log(instance)
      instance.SongQueued(err => {
        console.error(err)
      }, event => {
        console.log(event)
        this.emit('songAdded', event)

        // TODO add song to the playlist
        // event.returnValues.spotifyURI
      })
    })
  }

  async requestSong (spotifyURI) {
    const instance = await this.contract.deployed()
    const accounts = await this.web3.eth.getAccounts()
    console.log(instance)
    let contractSongInfo = await instance.getSong(spotifyURI, {from: accounts[0]})
    console.log(contractSongInfo)
    await instance.requestSong(spotifyURI, {from: accounts[0], value: contractSongInfo[1]})

    // userid, playlistid
    this.spotify.addTracksToPlaylist('1163045998', '0gl05yuwcUWrP0N0tGYRTu', ['spotify:track:' + spotifyURI]).then(data => {
      console.log(data)
    }, err => {
      console.error('Something went wrong!', err)
    })
  }

  // makes the song more expensive to request
  async banSong (spotifyURI) {
    let instance = await this.contract.deployed()
    let banPrice = await instance.getBanPrice().call({from: this.web3.account})
    await instance.banSong(spotifyURI).send({from: this.web3.account, value: banPrice})
  }

  async getSongInfo (spotifyURI) {
    // returns the spotify info and current queue status for a song
    // TODO get the spotify song info from the API

    let spotifyInfo = {}

    let deployed = await this.contract.deployed()
    let contractSongInfo = await deployed.getSong(spotifyURI)

    return Object.assign(spotifyInfo, contractSongInfo)
  }

  async searchSong (query) {
    await this.spotify.searchTracks(query, {limit: 5})
  }

  on (name, handler) {
    if (this._events.hasOwnProperty(name)) {
      this._events[name].push(handler)
    } else {
      this._events[name] = [handler]
    }
  }

  off (name, handler) {
    if (!this._events.hasOwnProperty(name)) {
      return
    }

    if (!handler) {
      this._events[name] = []
    } else {
      let index = this._events[name].indexOf(handler)
      if (index !== -1) {
        this._events[name].splice(index, 1)
      }
    }
  }

  emit (name, ...args) {
    if (!this._events.hasOwnProperty(name)) {
      return
    }

    if (!args || !args.length) {
      args = []
    }

    let event = this._events[name]
    for (let i = 0; i < event.length; i++) {
      event[i].apply(null, args)
    }
  }
}

export default Blockify
