async function main() {
  const NFTImplementation = await ethers.getContractFactory("NftCollection");

  console.log("Deploying proxy ...");
  const NftCollection = await NFTImplementation.deploy();

  console.log("proxy deployed to:", NftCollection.address);
  // console.log("version no. : ", await Nft.sayversion(), await Nft.symbol());

  const NftFactory = await ethers.getContractFactory("NftCollectionFactory");

  const Factory = await upgrades.deployProxy(NftFactory, [NftCollection.address], {
    kind: "uups",
    initializer: "initialize",
  });

  console.log("factory deployed to:", Factory.address);
  console.log(await Factory.collectionsOf("0x504D51f62846fbeee1c3d5ae518398b5d22bB905"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
