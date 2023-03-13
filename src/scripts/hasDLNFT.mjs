import { useAddress, useOwnedNFTs, useContract, ChainId } from "@thirdweb-dev/react";
import { useContext } from "react";
import ChainContext from "../context/Chain.ts";
import ShowCollection from "../scripts/ShowCollection.mjs";

export default function HasDLNFT() {
  const { selectedChain } = useContext(ChainContext);
    const address = useAddress();
    const { contract } = useContract(process.env.REACT_APP_MAINNET_ADDRESS);
  const { data: nfts } = useOwnedNFTs(contract, address);
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