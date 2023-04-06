const { ethers } = require("hardhat");

async function main() {
  const Rating = await (
    await ethers.getContractFactory("rating")
  ).deploy();

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
