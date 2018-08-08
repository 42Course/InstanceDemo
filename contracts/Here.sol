pragma solidity ^0.4.14;

import './Ownable.sol';

contract Here is Ownable {
    
    struct Place{
        address user_id;
        string content;
        string _to;
        string photo;
        string location;
        uint32 createTime;
        uint32 status;
    }
    
    Place[] public places;
    string[] public photos;
    mapping (uint => address) public placeToOwner;
    mapping (address => uint) ownerPlaceCount;
    uint public totalPlace;
    
    event NewPlace(uint _id, string _content, string _to, string _photo, string _location);
    
    function _createPlace(string _content, string _to, string _photo, string _location, address _id) returns(uint id){
        id = places.push(Place(_id, _content, _to, _photo, _location, uint32(now), 0)) - 1;
        placeToOwner[id] = msg.sender;
        ownerPlaceCount[msg.sender]++;
        totalPlace ++;
        NewPlace(id, _content, _to, _photo, _location);
    }
    
    function checkInfo() returns (uint balance, uint placeCount) {
        balance = this.balance;
        placeCount = totalPlace;
    }

    function checkPlace(uint index) returns (string content, string photo, string location, uint createTime) {
        Place memory myPlace = places[index];

        content = myPlace.content;
        photo = myPlace.photo;
        location = myPlace.location;
        createTime = myPlace.createTime;
    }

    function getPlaceByOwner(address _owner) returns(uint[]) {
        uint[] memory result = new uint[](ownerPlaceCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < places.length; i++) {
          if (placeToOwner[i] == _owner) {
            result[counter] = i;
            counter++;
          }
        }
        return result;
    }
}
