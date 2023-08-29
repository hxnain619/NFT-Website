const contractAddress = "0x3e4398520f63dda288b1ea416a06af5dfe18d44d";
const main = async () => {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   process.env.STAGING_QUICKNODE_KEY
  // );
  // const signer = hre.ethers.getSigner(process.env.PRIVATE_KEY, provider);
  let baseContract = await hre.ethers.getContractFactory("NftCollection");
  let contract = baseContract.attach(contractAddress);
  console.log(contract.address);

  // Get the filter for the event
  const filter = contract.filters.TransferSingle();

  // Get the events using the filter
  const events = await contract.queryFilter(filter, 24881152, 24883066);

  events.forEach((event) => {
    console.log("Event:", event);
    console.log("Event arguments:", event.args);
  });

  // const tx = await contract.safeTransferFrom(
  //   "0x01A6DaF2Dd9066ee5b06a71be71fC57ff64EE610",
  //   "0x41C0E0c0255e9111c385428a5eBE677599e4A0d0",
  //   2,
  //   1,
  //   "0x"
  // );
  // await tx.wait();
  // console.log(tx.hash);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
