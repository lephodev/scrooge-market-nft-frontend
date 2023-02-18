import { useAddress, useOwnedNFTs, useContract, useContractRead, ThirdwebNftMedia, useNetwork, ChainId, useNFTs } from "@thirdweb-dev/react";
import ChainContext from "../context/Chain";
import { useContext } from "react";
import DuckDivider from '../images/dividerLogo1.jpg';

export default function ShowCollection() {
  const { selectedChain, setSelectedChain } = useContext(ChainContext);
  const addresses = {
    [String(ChainId.Mainnet)]: "0xEe7c31b42e8bC3F2e04B5e1bfde84462fe1aA768",
    [String(ChainId.BinanceSmartChainMainnet)]: "0x729FDb31f1Cd2633aE26F0A87EfD0CC55a336F9f",
  };
  const { contract } = useContract(addresses[String(selectedChain)]);
  const { data: nfts, isLoading, error } = useNFTs(contract, { start: 0, count: 100 });
  
  return (
    
    <div>
      <div className="pageTitle">
        <img className="collection-header-img" src={DuckDivider} alt="Explore Ducky Lucks NFT Collection" />
            <h1>Ducky Lucks NFTs</h1>
        </div>
      {(isLoading || (typeof nfts === "undefined")) ? (
         <p className="gold font-martian">You have no NFTs. Please connect your wallet and/or purchase an NFT token package.</p>
      ) : (
        <div className="flex-row">
          {nfts.map((nft) => (
            <div className="erc721Card">
              <div className="erc721Card-name">            
               {nft.metadata.name}
               <br></br><br></br>
                <ThirdwebNftMedia className="erc721Card-image"
                  key={nft.metadata.id}
                  metadata={nft.metadata}
                  height={300}
                />
              </div>
              <div className="erc721Card-details">
               <span className="erc721Card-col-title">TRAITS</span><br></br><br></br>
                Background: <span>{nft.metadata.attributes[4].value}</span><br></br>
                Feathers: <span>{nft.metadata.attributes[5].value}</span><br></br>
                Head: <span>{nft.metadata.attributes[6].value}</span><br></br>
                Clothes: <span>{nft.metadata.attributes[7].value}</span><br></br>
                Eyes: <span>{nft.metadata.attributes[8].value}</span><br></br>
                Mouth: <span>{nft.metadata.attributes[9].value}</span><br></br>
                Accessories: <span>{nft.metadata.attributes[10].value}</span><br></br>
                
              </div>
              <div className="erc721Card-3rd-col">
                <span className="erc721Card-col-title">RARITY</span><br></br><br></br>
                Duck ID: <span>{nft.metadata.attributes[0].value}</span><br></br>
                Token ID: <span>{nft.metadata.id}</span><br></br>
                Brood: <span>{nft.metadata.attributes[3].value}</span><br></br>
                Birthday: <span>{nft.metadata.attributes[2].value}</span><br></br>
                Hash: <span>{nft.metadata.attributes[1].value}</span><br></br>
                {(nft.metadata.attributes[12].value <= 20) ? 
                  (<div className="rarity-pct-1">
                    Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                    Rarity Percentage: <span>{nft.metadata.attributes[12].value}</span><br></br>
                  </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 20 && nft.metadata.attributes[12].value <= 30) ? 
                (<div className="rarity-pct-2">
                  Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                  Rarity Percentage: <span>{nft.metadata.attributes[12].value}</span><br></br>
                </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 30 && nft.metadata.attributes[12].value <= 40) ? 
                  (<div className="rarity-pct-3">
                    Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                    Rarity Percentage: <span>{nft.metadata.attributes[12].value}</span><br></br>
                  </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 40 && nft.metadata.attributes[12].value <= 50) ? 
                (<div className="rarity-pct-4">
                  Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                  Rarity Percentage: <span>{nft.metadata.attributes[12].value}</span><br></br>
                </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 50 && nft.metadata.attributes[12].value <= 60) ? 
                  (<div className="rarity-pct-5">
                    Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                    Rarity Percentage: <span>{nft.metadata.attributes[12].value}</span><br></br>
                  </div>) : (<span></span>)}
                {(nft.metadata.attributes[12].value > 60 && nft.metadata.attributes[12].value <= 70) ? 
                (<div className="rarity-pct-6">
                  Rarity Points: <span>{nft.metadata.attributes[11].value}</span><br></br>
                  Rarity Percentage: <span>{nft.metadata.attributes[12].value}</span><br></br>
                </div>) : (<span></span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
