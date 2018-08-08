import React, { Component } from 'react'
import HereContract from '../build/contracts/Here.json'
import getWeb3 from './utils/getWeb3'

import { Layout, Menu, Spin, Alert, Button } from 'antd';
import ContentList from './components/ContentList';

import NewPlaceDialog from './components/NewPlaceDialog';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  handleDialog = (e) =>{
    e.preventDefault();

    this.setState({
      show: true
    })
  }

  renderContent = () => {
    const { account, here, web3, mode, show } = this.state;

    if (!here) {
      return <Spin tip="Loading..." />;
    }

    return <div>
       <Button type="primary" shape="circle" icon="download" size="large" className="add-btn" onClick={this.handleDialog}/>
       <NewPlaceDialog show={show} here={here} account={account}/>
       <ContentList account={account} here={here} web3={web3} />
    </div>

    
  }

  instantiateContract() {

    const contract = require('truffle-contract')
    const Here = contract(HereContract)
    Here.setProvider(this.state.web3.currentProvider)

    var HereInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({
        account: accounts[0],
      });

      Here.deployed().then((instance) => {
        HereInstance = instance

        this.setState({
          here: instance,
          show: false
        });
      });

    })
  }

  render() {
    return (
      this.renderContent()
    );
  }
}

export default App
