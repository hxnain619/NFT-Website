const mintCollectionAbi = [
  "function createCollection(string memory _name, string memory _symbol, string memory _description) public {}",
  "function importCollection(string memory _name, string memory _symbol, address collectionAddress) public {}",
  "function collectionsOf(address user) public view returns (address[] memory)",
];

const mintSingleAbi = [
  "function mint(address to, uint256 id, uint256 amount, string memory uri, bytes memory data) public {}",
  "function setApprovalForAll(address operator, bool approved) public virtual override {}",
  "function isApprovedForAll(address account, address operator) public view returns (bool)",
];

const mintSoulAbi = [
  "function safeMint(address to, string memory uri) public {}",
  "function setApprovalForAll(address operator, bool approved) public virtual override {}",
  "function isApprovedForAll(address account, address operator) public view returns (bool)",
];

const marketAbi = ["function getMarketItems() public view {}"];

const mintAbi = ["function mintBatch( address to, uint256[] memory ids, string[] memory uris) public {}"];

export { mintCollectionAbi, mintSoulAbi, mintSingleAbi, marketAbi, mintAbi };
