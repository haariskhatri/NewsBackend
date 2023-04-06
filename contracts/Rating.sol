//SPDX-License-Identifier:MIT

pragma solidity ^0.8.18;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// interface IERC20{
//     function transfer(address to, uint256 amount) external virtual returns (bool);
// }

contract rating is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private transactionIds;
    mapping(string url => bool)  public urls;
    address public manager;
    address public bank = 0xE6CeDCA3F9A8710e22d64e82E383520776470a05;
    uint private Reward;
    uint[] public requests;
    

    constructor() {
        manager = msg.sender;
        Reward = 30 ether;
    }

    function getReward() public view returns (uint) {
        return Reward;
    }

    function changeReward(uint _reward) external onlyadmin {
        Reward = _reward;
        emit RewardChanged(_reward, block.timestamp);
    }

    //events
    event RequestMade(address indexed userAddress, uint id, uint amount);
    event RequestApproved(
        address indexed ApproverAddress,
        uint id,
        uint amount
    );
    event UserAdded(address UserAddress, uint timestamp);
    event RewardChanged(uint reward, uint timestamp);

    modifier onlyadmin() {
        require(msg.sender == manager, "Not admin");
        _;
    }

    struct User {
        address userAddress;
        uint balance;
    }
    mapping(address userAddress => User) public users;

    enum Status {
        UNAPPROVED,
        APPROVED
    }

    struct Transaction {
        uint id;
        address user;
        string url;
        uint rating;
        uint reward;
        uint timestamp;
        Status transactionStatus;
    }
    mapping(uint id => Transaction) public transactions;

    mapping(address user => uint request) public userRequests;

    function addUser() internal {
        require(users[msg.sender].userAddress == address(0), "Already Exists");
        users[msg.sender] = User({userAddress: msg.sender, balance: 0});
        emit UserAdded(msg.sender, block.timestamp);
    }

    function addTransaction(string memory _url, uint _rating) external {
        require(urls[_url] != true, "url already exists");

        if (users[msg.sender].userAddress == address(0)) {
            addUser();
        }
        urls[_url] = true;
        transactionIds.increment();
        uint id = transactionIds.current();
        uint reward = getReward(_rating);

        transactions[id] = Transaction({
            id: id,
            user: msg.sender,
            url: _url,
            rating: _rating,
            reward: reward,
            timestamp: block.timestamp,
            transactionStatus: Status.UNAPPROVED
        });
        userRequests[msg.sender] += 1;
        requests.push(id);
        emit RequestMade(msg.sender, id, reward);
    }

    function getReward(uint _rating) public view returns (uint) {
        return _rating * Reward;
    }

    function getBalance() public view returns (uint) {
        return IERC20(bank).balanceOf(msg.sender);
    }

    function Approve(uint _id) external onlyadmin {
        require(
            transactions[_id].transactionStatus != Status.APPROVED,
            "Already Approved"
        );

        Transaction storage order = transactions[_id];
        User storage user = users[order.user];

        uint reward = order.reward;

        IERC20(bank).transfer(order.user, reward);
        user.balance += reward;
        order.transactionStatus = Status.APPROVED;

        for(uint i = 0 ; i < requests.length -1; i++){
             requests[i] = requests[i+1];
         }
        requests.pop();

        emit RequestApproved(msg.sender, order.id, reward);
    }
}
