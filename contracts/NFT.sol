//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';


contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    address ContractAddress;
    constructor(address Marketaddress) ERC721('KryptoBirdz','KBIRDZ'){
        ContractAddress=Marketaddress;
    }

    function mintToken(string memory tokenURI) public returns(uint){
        _tokenIDs.increment();
        uint256 newItemId =_tokenIDs.current();
        _mint(msg.sender,newItemId);
        _setTokenURI(newItemId,tokenURI);
        setApprovalForAll(ContractAddress,true);
        return(newItemId);

    }
}