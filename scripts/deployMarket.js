async function main() {
  const NFTMarketFactory = await ethers.getContractFactory("NFTMarket");

  console.log("Deploying proxy ...");

  // console.log("version no. : ", await Nft.sayversion(), await Nft.symbol());

  const NFTMarket = await upgrades.deployProxy(NFTMarketFactory, ["GenaDrop"], {
    kind: "uups",
    initializer: "initialize",
  });

  console.log("proxy deployed to:", NFTMarket.address);
  console.log(await NFTMarket._itemsSold());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
