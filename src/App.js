import { Routes, Route } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar';
import MarketPlace from './components/MarketPlace';
import MintItem from './components/Mint-item';
import MyNft from './components/My-nft'
import AccountDashBoard from './components/Account-dashboard';

function App() {
 
    
  // const [nfts, setnfts] = useState([])
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path="/" element={<MarketPlace/>}/>
        <Route path="Mint-item" element={<MintItem/>}>
          </Route>
          <Route path="My-Nft" element={<MyNft/>}>
          </Route>
          
          <Route path="Account-dashboard" element={<AccountDashBoard/>}>
          </Route>
      </Routes>
   
    </div>
  );
}

export default App;
