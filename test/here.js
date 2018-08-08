var Here = artifacts.require("./Here.sol");

contract('Here', function(accounts) {

  it("...adding data", function() {
    return Here.deployed().then(function(instance) {
      hereInstance = instance;

      return hereInstance._createPlace("this is content", "someone", "url", "location", accounts[0], {from: accounts[0]});

    }).then(function(result) {
      // console.log(JSON.stringify(result));


      return hereInstance.checkPlace.call(0, {from: accounts[0]});
      // return hereInstance.getPlaceByOwner.call(accounts[0], {from: accounts[0]});
    })
    .then(function(arr) {
      console.log(JSON.stringify(arr));
    });
  });

});
