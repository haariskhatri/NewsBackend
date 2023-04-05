const {ethers} = require("hardhat");

async function main(){
    const VerifySignature = await (await ethers.getContractFactory("VerifySignature")).deploy();
    
    console.log("Deployed address : " , await VerifySignature.address);

}

main().then(()=>{
    process.exitCode = 0;

}).catch((error)=>{
    console.error(error);
    process.exitCode = 1;
})