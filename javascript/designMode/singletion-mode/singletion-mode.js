// class Singletion {
//     constructor(name) {
//         this.name = name;
//     }
// }

// function createAdmin(name) {
//     if (!Singletion.instance) {
//         Singletion.instance = new Singletion(name);
//     }
//     return Singletion.instance; 
// }

// let admin1 = createAdmin("js");
// let admin2 = createAdmin("node");

// console.log(admin1 === admin2);
// console.log("admin1 : ", admin1.name);
// console.log("admin2 : ", admin2.name);


// class Singletion {
//     constructor(name) {
//         if (!Singletion.instance) {
//             this.name = name;
//             Singletion.instance = this;
//         }
//         return Singletion.instance;
//     }

//     printName() {
//         console.log(this.name);
//     }
// }

// let admin1 = new Singletion("js");
// let admin2 = new Singletion("node");

// console.log(admin1 === admin2);
// console.log("admin1 : ", admin1.name);
// console.log("admin2 : ", admin2.name);

// admin1.printName();
// admin2.printName();

// let admin = {
//     _name : 'js',
//     setName : (name) => {
//         this._name = name;
//     },
//     getName : () => {
//         return this._name;
//     }
// };

let adminName = (function Singletion(name) {
    return () => {
        return name;
    };
})("javascript");

console.log(adminName());