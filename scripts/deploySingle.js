async function main() {
  const NftSingleFactory = await ethers.getContractFactory("NftSingle");

  console.log("Deploying proxy ...");
  const NftSingle = await upgrades.deployProxy(
    NftSingleFactory,
    ["Genadrop 1 of 1", "GND", "0x504D51f62846fbeee1c3d5ae518398b5d22bB905"],
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
