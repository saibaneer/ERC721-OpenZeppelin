const SimpleCollectible = artifacts.require("SimpleCollectible");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */





contract("SimpleCollectible", function (accounts) {

  it("should assert true", async function () {
    const simpleCollectible = await SimpleCollectible.new({from: accounts[0]});
    return assert.isTrue(true);
  });

  it("should test that a new collectible has been added", async function(){
    //will modify state of the blockchain and produce transaction object/hash
    const simpleCollectible = await SimpleCollectible.new({from: accounts[0]});
    await simpleCollectible.setMaximumTokens(2, {from: accounts[0]});
    let link = "https://ipfs.io/ipfs/QmVr1vGB41XzhAnwnNt6GKZgnn3hTrC4D6j92fx41jMbM7"; 
    await simpleCollectible.createCollectible(link, {from: accounts[0]});

    //will use ERC721 getter functions to test the owner received the first token
    result = await simpleCollectible.ownerOf(1);  
    assert.equal(result, accounts[0]);
  });

  it("should test that no more than 2 tokens can be minted", async function(){
    let link1 = "https://ipfs.io/ipfs/QmVr1vGB41XzhAnwnNt6GKZgnn3hTrC4D6j92fx41jMbM7";
    let link2 = "www.yahoo.com";
    let link3 = "www.fool.com";
    //create 1st collectible
    const simpleCollectible = await SimpleCollectible.new({from: accounts[0]});
    await simpleCollectible.setMaximumTokens(2, {from: accounts[0]});
    await simpleCollectible.createCollectible(link1, {from: accounts[0]});

    //create 2nd collectible
    await simpleCollectible.createCollectible(link2, {from: accounts[0]});

    //create 3rd collectible
    try {
      await simpleCollectible.createCollectible(link3, {from: accounts[0]});
    } catch(err) {
      assert(err.message.includes("You cannot mint anymore tokens"));
      return;
    }
    assert(false);    
  });
  it("should test that an NFT cannot be minted until maximum tokens is set", async function(){
    let link1 = "https://ipfs.io/ipfs/QmVr1vGB41XzhAnwnNt6GKZgnn3hTrC4D6j92fx41jMbM7";
    const simpleCollectible = await SimpleCollectible.new({from: accounts[0]});
    try {
      await simpleCollectible.createCollectible(link1, {from: accounts[0]});
    } catch(err) {
      assert(err.message.includes("Maximum tokens have not been set"));
      return;
    }
    assert(false);
  });
  it("should NOT allow maximum tokens to be set more than once", async function(){
    const simpleCollectible = await SimpleCollectible.new({from: accounts[0]});
    await simpleCollectible.setMaximumTokens(2, {from: accounts[0]});
    try{
      await simpleCollectible.setMaximumTokens(3, {from: accounts[0]});
    } catch(err) {
      assert(err.message.includes("Function can only be called once"));
      return;
    }
    assert(false);
  });
  it("should NOT allow non-owners set Maximum tokens", async function(){
    const simpleCollectible = await SimpleCollectible.new({from: accounts[0]});
    try{
    await simpleCollectible.setMaximumTokens(2, {from: accounts[1]});
  } catch(err) {
    assert(err.message.includes("You are not authorized"));
    return;
  }
  assert(false);
  });

});
