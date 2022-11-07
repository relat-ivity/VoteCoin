import {Button, Input, Table} from 'antd';
import {UserOutlined} from "@ant-design/icons";
import {SetStateAction, useEffect, useState} from 'react';
import type { ColumnsType } from 'antd/es/table';
import {VoteCoinContract, VoteERC20Contract, web3} from "../utils/contracts";
import './main.css';
import { ColumnType } from 'antd/lib/table';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const MainPage = () => {
    const [account, setAccount]=useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [accountPro_num,setAccountPro_num] = useState(0)
    const [ProContent, setProContent] = useState('')
    const [Duration, setDuration] = useState(1)
    const [InputN, setInputN] = useState('1')

    var alldata_flag=0;
    interface User{
        pid: string;
        pros: string;
        cons: string;
        duration: string;
        content: string;
      }
    const [userdata,setUserData]=useState([{
        pid: '12',
        pros: '12',
        cons: '12',
        duration: '12',
        content: '12'
    }])
    const [alldata, setAllData]=useState([{
        pid: '12',
        pros: '12',
        cons: '12',
        duration: '12',
        content: '12'
    }])


    useEffect(() => {   //页面生成时回调
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        async function InitALLPro() {
            alldata.pop()
            setAllData([])
            if(alldata_flag++) return;
            const pro_num = await VoteCoinContract.methods.pro_num().call()
            let i=0;
            let tempdata;
            for(i=0; i < pro_num; i++){
                tempdata=alldata
                const pro = await VoteCoinContract.methods.proposals(i).call()
                var data=new Date(Number(pro['DDL']+"767"))
                var timep=data.toLocaleString()
                const thispro={
                    pid: pro[0],
                    pros: pro[2],
                    cons: pro[3],
                    duration: timep,
                    content: pro[1]
                }
                tempdata.push(thispro);
                tempdata=[...tempdata]
                setAllData(tempdata)
                console.log(tempdata)
            }
        }

        userdata.pop()
        setUserData([])
        initCheckAccounts()
        InitALLPro()
    }, [])


    const Inituserdata = async() => {
        while(userdata.length>0){
            userdata.pop()
        }
        setUserData([])
        const pro_num = await VoteCoinContract.methods.pro_num().call()
        let i=0;
        let tempdata;
        for(i=0; i < pro_num; i++){
            tempdata=userdata
            const pro = await VoteCoinContract.methods.proposals(i).call()
            if(account.toLowerCase()===pro[4].toLowerCase())
            {
                var data=new Date(Number(pro['DDL']+"767"))
                var timep=data.toLocaleString()
                const thispro={
                    pid: pro[0],
                    pros: pro[2],
                    cons: pro[3],
                    duration: timep,
                    content: pro[1]
                }
                tempdata.push(thispro);
                tempdata=[...tempdata]
                setUserData(tempdata)
            }
        }
    }


    useEffect(() => {   //account改变时回调
        const getAccountInfo = async () => {
            if (VoteERC20Contract) {
                const account_balance = await VoteERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(account_balance)
            } else {
                alert('Contract not exists.')
            }
        }

        const getPro_num = async () => {
            if (VoteERC20Contract) {
                const accountPro = await VoteERC20Contract.methods.GetPro_num(account).call()
                setAccountPro_num(accountPro)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
            getPro_num()
            Inituserdata()
        }
    }, [account])

    const onClickConnectWallet = async () => {   //助教的开源Demo
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }
    
    const onClickInitial = async() => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (VoteERC20Contract) {
            try {
                await VoteERC20Contract.methods.InitialCoin().send({
                    from: account
                })
                const account_balance = await VoteERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(account_balance)
                alert('You have received initial coins.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const OnClickPutForward = async() => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if(ProContent === '') {
            alert('请输入提案内容')
            return
        }

        if(Duration<=0 || Duration >600){ //////////////////////////////////////////////////////////////////////////////
            alert('请输入正确的时间（1-24）')
            return;
        }

        if (VoteCoinContract && VoteERC20Contract) {
            try {
                await VoteERC20Contract.methods.approve(VoteCoinContract.options.address, 30).send({
                    from: account
                })
                await VoteCoinContract.methods.PutForword(ProContent, Duration).send({
                    from: account
                })
                const account_balance = await VoteERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(account_balance)
                alert('提案发送成功')
                setProContent('')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const OnClickRow = async(pid: string) =>{
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        try {
            const pid_num=Number(pid)
            console.log(pid_num)
            await VoteCoinContract.methods.Finish(pid_num).send({
                from: account
            })
            alert('提案结算成功')
        } catch (error: any) {
            alert(error.message)
        }
    }

    const OnClickPro = async(pid: string) =>{
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        try {
            const pid_num=Number(pid)
            console.log(pid_num)
            await VoteERC20Contract.methods.approve(VoteCoinContract.options.address, 5).send({
                from: account
            })
            await VoteCoinContract.methods.Pass(pid_num).send({
                from: account
            })
            alert('投票成功')
        } catch (error: any) {
            alert(error.message)
        }
    }

    const OnClickCon = async(pid: string) =>{
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        try {
            const pid_num=Number(pid)
            console.log(pid_num)
            await VoteERC20Contract.methods.approve(VoteCoinContract.options.address, 5).send({
                from: account
            })
            await VoteCoinContract.methods.Reject(pid_num).send({
                from: account
            })
            alert('投票成功')
        } catch (error: any) {
            alert(error.message)
        }
    }


    const columns: ColumnsType<User> = [
        {
            title: '提案ID',
            align: 'center',
            dataIndex: 'pid',
            width:80
        },
        {
            title: '赞成票',
            align: 'center',
            dataIndex: 'pros',
            width: 80
        },
        {
            title: '反对票',
            align: 'center',
            dataIndex: 'cons',
            width: 80
        },
        {
            title: '截止时间',
            align: 'center',
            dataIndex: 'duration',
            width: 200
        },
        {
            title: '提案内容',
            dataIndex: 'content',
        },
        {
            title: '到期结算',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (_, record: { pid: string }) => <Button type="primary" onClick={()=>OnClickRow(record.pid)}>Action</Button>,
        },
    ];

      const columns2: ColumnsType<User>=[
        {
            title: '提案ID',
            align: 'center',
            dataIndex: 'pid',
            width:80
        },
        {
            title: '截止时间',
            align: 'center',
            dataIndex: 'duration',
            width: 200
        },
        {
            title: '提案内容',
            dataIndex: 'content',
        },
        {
            title: '赞成票',
            align: 'center',
            dataIndex: 'pros',
            width: 80
        },
        {
            title: '反对票',
            align: 'center',
            dataIndex: 'cons',
            width: 80
        },
        {
            title: '赞成',
            fixed: 'right',
            width: 80,
            align: 'center',
            render: (_, record: { pid: string }) => <Button type="primary" onClick={()=>OnClickPro(record.pid)}>Vote</Button>
        },
        {
            title: '反对',
            fixed: 'right',
            width: 80,
            align: 'center',
            render: (_, record: { pid: string }) => <Button type="primary" onClick={()=>OnClickCon(record.pid)}>Vote</Button>
        },
    ]

    return (
        <div className='ALL'>
           <div className='title'>
                <div className='title_word'>VoteCoin虚拟货币投票系统</div>
            </div> 
            <div className='body_'>
                <div className='account'>
                     <h1>账户信息</h1>
                    <div className='account_body'>
                        <p>您的账户地址是：{account === '' ? '暂无用户连接' : account}</p>
                        <Button type="primary" onClick={onClickConnectWallet}>Link Account</Button>
                        <div className='account_imf'>
                            <p>您的用户余额是：{account === '' ? 0 : accountBalance}</p>
                            <Button type="primary" onClick={onClickInitial}>新用户奖励</Button>
                        </div>
                        <div className='account_imf'>
                            <p>您已通过了{account === '' ? 0 : accountPro_num}个提案</p>
                        </div>
                    </div>
                </div>
                <div className='upPro'>
                    <h1>提出新提案</h1>
                    <div className='newPro'>
                        <Input.Group compact>
                        <Input value={ProContent} 
                            addonBefore="提案内容" 
                            style={{ width: 'calc(80% - 200px)' }} 
                            placeholder="提案内容（尽量精简）" 
                            onChange={e => {
                                setProContent(e.target.value);
                            }}/>
                        <Input value={InputN}
                            addonBefore="持续分钟" 
                            style={{ width: '130px' }} 
                            placeholder="minutes"
                            onChange={e=>{
                                console.log(parseInt(e.target.value))
                                if(isNaN(parseInt(e.target.value))){
                                    setDuration(0);
                                    setInputN("");
                                    return;
                                }
                                setInputN(e.target.value)
                                setDuration(parseInt(e.target.value));
                            }}/>
                        <Button type="primary" onClick={OnClickPutForward}>Submit</Button>
                        </Input.Group>
                        <br />
                    </div>
                </div>
                <div className='myPro'>
                    <h1>本用户的提案</h1>
                    <Table dataSource={userdata} 
                    columns={columns} 
                    size={'middle'}
                    pagination={{ pageSize: 3}}
                    scroll={{ x: 1000}} />
                </div>
                <div className='allPro'>
                    <h1>所有提案</h1>
                    <Table dataSource={alldata} 
                    columns={columns2} 
                    size={'middle'}
                    pagination={{ pageSize: 5}}
                    scroll={{ x: 1000 }} />
                </div>
            </div>
            <div className='bottum_'>
                <div className='bottum_word'>
                    黄可欣 3200105739
                </div>
            </div> 
        </div>
    )
}
export default MainPage
