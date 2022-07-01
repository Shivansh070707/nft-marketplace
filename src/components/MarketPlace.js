import React from 'react'
import { ethers } from 'ethers';
import axios from 'axios';
import { useEffect,useState } from 'react';
import { Web3Modal } from 'web3modal';
import { nftmarketaddress,nftaddress } from '../contracts/config';
import NFT from '../contracts/NFT.json';
import KBMarket from '../contracts/KBMarket.json'

export const MarketPlace = () => {
    const [nfts, setnfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
  
      }, [])
    async function loadNFTs(){
    const provider=new ethers.providers.JsonRpcProvider()
    console.log("hii");
    const tokenContract= new ethers.Contract(nftaddress,NFT.abi,provider)
    const marketContract = new ethers.Contract(nftmarketaddress,KBMarket.abi,provider)
    console.log("hii");
    const data= await marketContract.fetchMarketToken()
    console.log(data);

    const items=await Promise.all(data.map(async i=>{
        const tokenUri= await tokenContract.tokenURI(i.tokenId)
        const meta= await axios.get(tokenUri)
        let price =ethers.utils.formatUnits(i.price,toString(),'ether')
        let item={
            price,
            tokenId:i.tokenId.toNumber(),
            owner:i.owner,
            seller:i.seller,
            image:meta.data.image,
            name:meta.data.name,
            description:meta.data.description

        }
        return item;
    }))
    setnfts(items)
    setLoadingState('loaded')

    }
    async function buyNFT(nft){
        const web3Modal= new Web3Modal()
        const  connection= await web3Modal.connect()
        const provider= new ethers.providers.Web3Provider(connection)
        const signer=provider.getSigner()
        const contract= new ethers.Contract(nftmarketaddress,KBMarket.abi,signer)
        
        const price= ethers.utils.parseUnits(nft.price.toString(),'ether')
        const transation =await contract.createMarketSale(nftaddress,nft.tokenId,{value:price})
        await transation.wait()
        loadNFTs()

    }
    if(loadingState ==='loaded' && !nfts.length) return(
        <h2>No Nft</h2>
    )

  return (
    <div>
      <div>
        <div>
          {
          nfts.map((nft,i)=>(
            <div key={i}>
              <img src={nft.image}/>
              <div>
                <p>{nft.name}</p>
              </div>
              <div>
                <p>{nft.description}</p>
              </div>
              <div>
                <p>{nft.price} ETH</p>
                <button onClick={()=>buyNFT(nft)}> Buy </button>
              </div>

            </div>
          ))
          }

        </div>
      </div>
    </div>
  )
}

export default MarketPlace;