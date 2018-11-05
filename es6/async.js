
let p = new Promise(resolve => {
    resolve(20);
});

(async () => {
    let ret = await p.then(result => result);
    console.log(ret);
})();


function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function test() {
    await timeout(20000);
    let a = await 9;
    let b = await 10;
    console.log(a);
    console.log(b);
    console.log("hello");
    return 'over';
}

test().then(result => console.log(result));

console.log('i am before');
