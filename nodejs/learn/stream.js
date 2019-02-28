// let fs = require("fs");
// let data = '';

// let rdStream = fs.createReadStream("hello.js");

// rdStream.on('data', (chunk) => {
//     data += chunk;
// });

// rdStream.on("end", () => {
//     console.log(data);
// });

// rdStream.on("error", (err) => {
//     console.log(err);
// });

// console.log("结束");

// let fs = require("fs");
// let wrStream = fs.createWriteStream('output.txt');

// wrStream.write('hello nodejs', 'utf-8');

// wrStream.end();

// wrStream.on('finish', () => {
//     console.log('写完了');
// });

// console.log('结束');

let fs = require("fs");
let rd = fs.createReadStream('hello.js');
let wr = fs.createWriteStream('output.txt');

rd.pipe(wr);