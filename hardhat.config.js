/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");

let accounts = [
  "56fae8129c16de3f46e82e0347cf6c157c2bf6de7454f1bf46ee7d8b1b50092f",
];

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/f6f192f81294461f873a6243cfccad29",
      accounts: accounts,
    },
  },
  etherscan: {
    apiKey: "UX6AWTYFUAS99YJYVZ4W3FI8S5RVBP81WB",
  },
};
