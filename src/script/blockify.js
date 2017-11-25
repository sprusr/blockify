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

    // object for storing event handlers
    this._events = {}

    // Spotify web API
    this.spotify = new Spotify()
    this.spotify.setAccessToken(spotifyToken)

    // Contract event listeners
    this.contract.deployed().then(instance => {
      instance.events.SongQueued().on('data', event => {
        this.emit('songAdded', event)

        // TODO add song to the playlist
        // event.returnValues.spotifyURI
      })
    })
  }

  async requestSong (spotifyURI) {
    // publish to contract
  }

  async banSong (spotifyURI) {
    // makes the song more expensive to request
  }

  async getSongInfo (spotifyURI) {
    // returns the spotify info and current queue status for a song
    // TODO get the spotify song info from the API
  }

  async getQueue () {
    // returns the current queue
  }

  async getBans () {
    // returns the current queue
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
