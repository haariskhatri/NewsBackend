const { ethers } = require("hardhat");

async function main() {
  const Rating = await (
    await ethers.getContractFactory("rating")
  ).deploy("0xe6cedca3f9a8710e22d64e82e383520776470a05");

  console.log("Deployed address : ", await Rating.address);
}

main()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
