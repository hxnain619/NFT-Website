async function main() {
  const NftSingleFactory = await ethers.getContractFactory("NftSingle");

  console.log("Deploying proxy ...");
  const NftSingle = await upgrades.deployProxy(
    NftSingleFactory,
    ["NFTreasure 1 of 1", "TREASURE", "0x0949183501aA67a77fb009b46e8D7F07a3520352"],
    {
      kind: "uups",
      initializer: "initialize",
    }
  );
  console.log("proxy deployed to:", NftSingle.address);
  console.log("version no. : ", await NftSingle.name());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
