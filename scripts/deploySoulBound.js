async function main() {
  const NftSoulBoundFactory = await ethers.getContractFactory("NftSoulBound");

  console.log("Deploying proxy ...");
  const NftSoulBound = await NftSoulBoundFactory.deploy();

  await NftSoulBound.deployed();
  // await upgrades.deployProxy(
  //   NftContract,
  //   ["Genadrop 1 of 1", "GND", "0x504D51f62846fbeee1c3d5ae518398b5d22bB905"],
  //   {
  //     kind: "uups",
  //     initializer: "initialize",
  //   }
  // );
  console.log("proxy deployed to:", NftSoulBound.address);
  console.log("version no. : ", await NftSoulBound.name());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
