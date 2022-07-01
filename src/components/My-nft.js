
// we want to load the users nfts and display

import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftmarketaddress,nftaddress } from '../contracts/config';
import NFT from '../contracts/NFT.json';
import KBMarket from '../contracts/KBMarket.json'


export default function MyAssets() {
    // array of nfts
  const [nfts, setNFts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(()=> {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
    const data = await marketContract.fetchMyNFts()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // we want get the token metadata - json 
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image, 
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))

    setNFts(items)
    setLoadingState('loaded')
  }
  
  if(loadingState === 'loaded' && !nfts.length) return (<h1
  className='px-20 py-7 text-4x1'>You do not own any NFTs currently :(</h1>)

  return (
    <div >
          <div >
          <div >
            {
              nfts.map((nft, i)=>(
                <div key={i}>
                  <img src={nft.image} />
                  <div >
                    <p >{
                      nft.name}</p>
                      <div >
                        <p >{nft.description}</p>
                        </div>
                    </div>
                    <div>
                        <p>{nft.price} ETH</p>
                      </div>
                </div>
              ))
            }
          </div>
          </div>
    </div>
  )
}
