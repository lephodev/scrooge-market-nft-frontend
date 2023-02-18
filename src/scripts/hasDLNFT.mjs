import { useAddress, useOwnedNFTs, useContract } from "@thirdweb-dev/react";
import ChainContext from "../context/Chain";
import ShowCollection from "../scripts/ShowCollection.mjs";

export default function HasDLNFT() {
  const { selectedChain, setSelectedChain } = useContext(ChainContext);
    const address = useAddress();
    const { contract } = useContract("0xEe7c31b42e8bC3F2e04B5e1bfde84462fe1aA768");
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address);
  (e) => setSelectedChain(ChainId.Mainnet);
  //console.log("Contract: ", contract);
  //console.log("NFTs: ", nfts);
  return (
    <div>
        {nfts}
        HELLO

        <br></br><br></br>
        {(selectedChain === ChainId.Mainnet) ? (<div><ShowCollection /></div>) : (<div>WRONG NETWORK, DUMMY!</div>)}
    </div>
    
  );
}