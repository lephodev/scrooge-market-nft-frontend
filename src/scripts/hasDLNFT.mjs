import { useAddress, useOwnedNFTs, useContract, useContractRead } from "@thirdweb-dev/react";

export default function HasDLNFT() {
    const address = useAddress();
    const { contract } = useContract("0xEe7c31b42e8bC3F2e04B5e1bfde84462fe1aA768");
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address);
  console.log("Contract: ", contract);
  console.log("NFTs: ", nfts);
  return (
    <div>
        {nfts}
        HELLO
    </div>
    
  );
}