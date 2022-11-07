import Addresses from './contract-addresses.json'
import VoteCoin from './abis/VoteCoin.json'
import VoteERC20 from './abis/VoteERC20.json'

const Web3 = require('web3');

// @ts-ignore
// 创建web3实例
// 可以阅读获取更多信息https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
let web3 = new Web3(window.web3.currentProvider)

// 修改地址为部署的合约地址
const VoteCoinAddress = Addresses.VoteCoin
const VoteCoinABI = VoteCoin.abi
const VoteERC20Address = Addresses.VoteERC20
const VoteERC20ABI = VoteERC20.abi

// 获取合约实例
const VoteCoinContract = new web3.eth.Contract(VoteCoinABI, VoteCoinAddress);
const VoteERC20Contract = new web3.eth.Contract(VoteERC20ABI, VoteERC20Address);

// 导出web3实例和其它部署的合约
export {web3, VoteCoinContract, VoteERC20Contract}