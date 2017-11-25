import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import BlockifyJSON from '../../dist/contracts/Blockify.json'

class Blockify {
  constructor () {
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

    // Whisper topic hex strings
    this._shhTopics = {
      job: this.web3.utils.asciiToHex('job '),
      quote: this.web3.utils.asciiToHex('quot')
    }

    // set up Whisper with a new identity
    this.web3.shh.newKeyPair().then(id => {
      this._shhIdentity = id
      return this.web3.shh.newMessageFilter({
        privateKeyID: id
      })
    }).then(() => {
      return this._generateShhFilter()
    })
  }

  someFunction () {
    //
  }
}

export default Blockify
