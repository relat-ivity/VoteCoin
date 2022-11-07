// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./VoteERC20.sol";

struct Proposal{
    uint32 id;
    string content; //提案内容
    uint32 pros; //支持
    uint32 cons; //反对
    address presenter;
    uint32 time; //持续时间
    uint256 DDL; 
}

struct Voted{
    address voter;
    uint32 Pid;
}

contract VoteCoin {
    uint256 constant public proposalFee = 30; //提案费
    uint256 constant public voteFee = 5; //投票费
    uint256 constant public rewords = 50; //通过奖励 
    address[] public member;
    VoteERC20 public voteERC20;
    uint32 pid;
    Proposal[] public proposals; 
    uint32 public pro_num=0;
    Voted[] public voted;


    constructor() {
        voteERC20 = new VoteERC20("VoteCoin","VoteCoinSymbol");
        
        pid = 0;
    }
    
    function PutForword(string memory pro_content, uint32 hour) public{ //提出提案
        voteERC20.transferFrom(msg.sender,  address(this), proposalFee);
        pid++;
        Proposal memory pro;
        pro.id = pid;
        pro.content=pro_content;
        pro.cons = pro.pros = 0;
        pro.presenter = msg.sender; 
        pro.time = hour;
        pro.DDL = hour*60 + block.timestamp;
        proposals.push(pro);
        pro_num++;
    }

    function Pass(uint32 id) public{
        uint32 index;
        for(uint32 i=0;i<proposals.length;i++)
        {
            if(proposals[i].id == id){
                index=i;
                break;    
            } 
        }
        uint32 if_voted=0;
        for(uint32 i=0;i<voted.length;i++){
            if(voted[i].voter==msg.sender && voted[i].Pid==id){
                if_voted=1;
                break;
            }
        }
        require(proposals[index].presenter != msg.sender, "You can't vote on your proposal.");
        require(block.timestamp < proposals[index].DDL, "Vote time is up!");
        require(if_voted == 0, "This acount has voted on this proposal.");
        voteERC20.transferFrom(msg.sender,  address(this), voteFee);
        // Voted storage v;
        // v.voter=msg.sender;
        // v.Pid=id;
        // voted.push(v);
        proposals[index].pros++;
    }

    function Reject(uint32 id) public{
        uint32 index;
        for(uint32 i=0;i<proposals.length;i++)
        {
            if(proposals[i].id == id){
                index=i;
                break;    
            } 
        }
        uint32 if_voted=0;
        for(uint32 i=0;i<voted.length;i++){
            if(voted[i].voter==msg.sender && voted[i].Pid==id){
                if_voted=1;
                break;
            }
        }
        require(proposals[index].presenter != msg.sender, "You can't vote on your proposal.");
        require(block.timestamp < proposals[index].DDL, "Vote time is up!");
        require(if_voted == 0, "This acount has voted on this proposal.");
        voteERC20.transferFrom(msg.sender,  address(this), voteFee);
        // Voted memory v;
        // v.voter=msg.sender;
        // v.Pid=id;
        // voted.push(v);
        proposals[index].cons++;
    }

    function Finish(uint32 id) public{ //提案结算
        uint32 index=1;
        for(uint32 i=0;i<proposals.length;i++)
        {
            if(proposals[i].id == id){
                index=i;
                break;    
            } 
        }
        uint256 nowtime = block.timestamp;
        require(nowtime > proposals[index].DDL, "Vote is still on-going!");
        if(proposals[index].pros > proposals[index].cons) {
            voteERC20.AddProposalNum(msg.sender); 
            voteERC20.Reword(msg.sender);
        } 
        Proposal storage temp = proposals[proposals.length-1];
        proposals[proposals.length-1] = proposals[index];
        proposals[index] = temp;
        proposals.pop();
        pro_num--;
        for(uint32 i=0;i<voted.length;i++){
            if(voted[i].Pid==id){
                Voted storage temp1 = voted[voted.length-1];
                voted[voted.length-1] = voted[i];
                voted[i] = temp1;
                i--;
            }
        }
    }

}