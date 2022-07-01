import { ethers } from 'ethers';
import {useState } from 'react';
import Web3Modal  from 'web3modal';
import { nftmarketaddress,nftaddress } from '../contracts/config';
import NFT from '../contracts/NFT.json';
import KBMarket from '../contracts/KBMarket.json'
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useParams} from 'react-router-dom';
import './Mint-item.css'

const client =ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function MintItem(){
    const [fileUrl, setfileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({
        price:'',name:'',description:''
    })

    const router = useParams()
        
  

    async function onChange(e){
        const file = e.target.files[0]
        try{
            const added = await client.add(
                file,{
                    progress:(prog)=>{console.log(`recieved:${prog}`);}
                }
            )
            const url=`https://ipfs.infura.io/ipfs/${added.path}`
            setfileUrl(url)
        }catch(e){
            console.log("error",e);

        }

    }
    async function createMarket(){
        const {name,description,price}=formInput
        if(!name || !description || !price || fileUrl) return
        const data=JSON.stringify({name,description,image:fileUrl})
        try{
            const added = await client.add(data)
            const url=`https://ipfs.infura.io/ipfs/${added.path}`
            createSale(url)
        }catch(e){
            console.log("error",e);

        }
    } 
    async function createSale(url) {
        // create the items and list them on the marketplace
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        // we want to create the token
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.mintToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        
        // list the item for sale on the marketplace 
        contract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.MintMarketItem(nftaddress, tokenId, price, {value: listingPrice})
        await transaction.wait()
        router.push('./')
    }
    return(
        <div>
            <div className='abc'>
            <input
                placeholder='Asset Name'
                onChange={ e => updateFormInput({...formInput, name: e.target.value})} 
                />
            <textarea
                placeholder='Asset Description'
                onChange={ e => updateFormInput({...formInput, description: e.target.value})} 
                />
            <input
                placeholder='Asset Price in ETH'
                onChange={ e => updateFormInput({...formInput, price: e.target.value})} 
                />
            <input
                type='file'
                placeholder='Asset'
                onChange={onChange} 
                />{fileUrl && (
                    <img className='rounded mt-4' width='350px' src={fileUrl} />
                )}
                <button onClick={createMarket}
                >
                    Mint NFT
                </button>
            </div>
        </div>
    )

}



