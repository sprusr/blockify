module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 500000
    }
  },
  //contracts_build_directory: "./dist/contracts", // disabled until fix for https://github.com/trufflesuite/truffle-migrate/issues/10
  test_directory: "./test/contract"
};
