require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const {infura_id,private_key} =process.env;



module.exports = {
  defaultNetwork:"hardhat",
  solidity: {
    version:"0.8.4",
    settings:{
      optimizer:{
        enabled:true,
        runs:200
      }
    }
  },
  networks:{
    hardhat:{
     chainId:1337
    }
  ,
  rinkeby:{
    url:`${infura_id}`,
    accounts:[`${private_key}`]

  }
},
  etherscan:{
    apiKey:{
      rinkeby:"4T6GPMIGQRQA6TYAN58RE75521CWV4NK2I"
   }
 }

};
