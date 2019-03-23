var express = require('express');
var router = express.Router();
const User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
    res.render('register', {title: 'Register'});
});

router.post('/register', (req, res, next) => {
    const data = req.body;
    console.log(`user name = ${data.name}`);
    User.getByName(data.name, (err, user) => { // 检name是否被占用
        if (err) return next(err); // 
        console.log(`user id = ${user.id}`);
        if (user.id) { // 用户名存在
            res.error('Username already taken!');
            res.redirect('back'); // 重定向到上一级
        } else {
            console.log("add user");
            user = new User({
                name: data.name,
                pass: data.pass
            });
            user.save((err) => {
                if (err) return next(err);
                console.log(`user id = ${user.id}`);
                req.session.uid = user.id;
                res.redirect('/');
            });
        }
    });
});

module.exports = router;
