const redis = require('redis');
const bcrypt = require('bcrypt');
// 创建到redis的长连接
const db = redis.createClient();

class User {
    constructor(obj) {
        // 设定当前user的所有属性
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    update(cb) {
        const id = this.id;
        db.set(`user:id:$(this.name)`, id, (err) => { // 用名称索引用户ID
            if (err) return cb(err);
            db.hmset(`user:${id}`, this, (err) => { // 用redis存储当前类的属性
                cb(err);
            });
        });
    }

    save(cb) {
        if (this.id) {
            this.update(cb); // 如果设置了ID，则认为用户存在
        } else {
            db.incr('user:ids', (err, id) => { // 创建唯一ID
                if (err) return cb(err);
                this.id = id;
                this.hashPassword((err) => { // 密码哈希
                    if (err) return cb(err);
                    this.update(cb); // 保存用户属性
                });
            })
        }
    }

    hashPassword(cb) {
        bcrypt.genSalt(12, (err, salt) => { // 生成有12个字符的盐?
            if (err) return cb(err);
            bcrypt.hash(this.pass, salt, (err, hash) => { // 生成哈希
                if (err) return cb(err);
                this.pass = hash;
                cb();
            });
        });
    }

    static getId(name, cb) {
        db.get(`user:id:${name}`, cb); // 获取名称对应的id
    }

    static get(id, cb) {
        db.hgetall(`user:${id}`, (err, user) => {
            if (err) return cb(err);
            cb(null, new User(user));
        });
    }

    static getByName(name, cb) {
        User.getId(name, (err, id) => {
            console.log(id);
            if (err) return cb(err);
            User.get(id, cb);
        });
    }

    static authenticate(name, pass, cb) {
        User.getByName(name, (err, user) => {
            if (err) return cb(err);
            if (!user.id) return cb();
            bcrypt.hash(pass, user.salt, (err, hash) => {
                if (err) return cb(err);
                if (hash == user.pass) return cb(null, user);
                cb();
            });
        });
    }
}

// 导出
module.exports = User;
/*
const user = new User({ name: 'Example', pass: 'test' });
user.save((err) => {
    if (err) console.log(err);
    console.log(`user id ${user.id} ${user.pass}`);
});
*/
/*
User.getByName('Example', (err, user) => {
    console.log(user.name);
});
*/
