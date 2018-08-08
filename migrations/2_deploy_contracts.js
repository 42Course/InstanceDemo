var Ownable = artifacts.require("Ownable");
var SafeMath = artifacts.require("SafeMath");

var Here = artifacts.require("Here");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(SafeMath);

  deployer.link(Ownable, Here);
  deployer.deploy(Here);
};
