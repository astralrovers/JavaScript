// let buf_alloc = Buffer.alloc(10, 1);
// console.log(buf_alloc);

// let buf_alloc_unsafe = Buffer.allocUnsafe(10);
// console.log(buf_alloc_unsafe);

// let buf_arr = Buffer.from([1, 2, 0x33333]);
// console.log(buf_arr);

// let buf_str = Buffer.from('123');
// console.log(buf_str);

// let arrbuf = new ArrayBuffer(10);
// let buf_from_arrbuf = Buffer.from(arrbuf);
// arrbuf[0] = 9;
// buf_from_arrbuf.buffer[1] = 5;
// buf_from_arrbuf[1] = 4;
// console.log(arrbuf);
// console.log(buf_from_arrbuf);

// let buf_copy = Buffer.from(buf_arr);
// console.log(buf_copy);

// let buf = Buffer.alloc(256);
// console.log("len is ", buf.write("hello nodejs"));
// console.log(buf);
// console.log(String.fromCharCode(buf[0]));
//

// let buf = Buffer.alloc(20);

// for (let i = 0; i < buf.length; i++) {
//     buf[i] = i+97;
// }

// console.log(buf.toString('utf-8'));
//

// let buf = Buffer.from([1, 2, 3, 4, 5]);

// let json = JSON.stringify(buf);
// console.log(json);

// let copy = JSON.parse(json, (key, value) => {
//     return value && value.type == 'Buffer' ? Buffer.from(value.data) : value;
// });

// console.log(copy);
//

// let buf1 = Buffer.from('hello');
// let buf2 = Buffer.from([1, 2, 3]);

// console.log(buf1.compare(buf2));

// let buf3 = Buffer.concat([buf1, buf2]);

// console.log(buf3);

var buf1 = Buffer.from('abcdefghijkl');
var buf2 = Buffer.from('RUNOOB');

//将 buf2 插入到 buf1 指定位置上
buf2.copy(buf1, 2, 2, 4);

console.log(buf1.toString());