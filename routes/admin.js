const path = require("path");
const express = require("express");
const ethers = require("ethers")

const rootDir = require("../util/path");

const router = express.Router();

router.get('/',(req,res)=>{
    res.send("<h1>Hel </h1>");
})

CONTRACT_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [
      { internalType: "bytes32", name: "_messageHash", type: "bytes32" },
    ],
    name: "getEthSignedMessageHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "string", name: "_message", type: "string" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
    ],
    name: "getMessageHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_ethSignedMessageHash",
        type: "bytes32",
      },
      { internalType: "bytes", name: "_signature", type: "bytes" },
    ],
    name: "recoverSigner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "sig", type: "bytes" }],
    name: "splitSignature",
    outputs: [
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_signer", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "string", name: "_message", type: "string" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "verify",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "pure",
    type: "function",
  },
];

const CONTRACT_ADDRESS = 0x59176B7ecA2f65Cdb736584748D989aBC355c0E8;
const privatekey = "56fae8129c16de3f46e82e0347cf6c157c2bf6de7454f1bf46ee7d8b1b50092f";

const provider = new ethers.providers.InfuraProvider(network = "sepolia" , "f6f192f81294461f873a6243cfccad29");
const signer = new ethers.Wallet(privatekey,provider);

const mycontract = new ethers.Contract(CONTRACT_ADDRESS,CONTRACT_ABI,signer);



exports.routes = router;