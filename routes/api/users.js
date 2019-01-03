
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const User = require('../../models/User');
const passport = require('passport');

router.post('/register', (req,res) => {
    

    User.findOne({email:req.body.email})
        .then((user) => {
            if(user) {
                return res.status(400).json('邮箱已被注册!');
            }else{
                const avatar = gravatar.url(req.body.email,{s:'200',r:'pg',d:'mm'});
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password:req.body.password,
                    identity:req.body.identity
                })

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt,(err, hash) =>{
                       if(err) throw err;
                       newUser.password = hash;
                        newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch(err => console.log(err));
                    });
                });
            }
        })
})

// jwt password
router.post('/login',(req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json('用户不存在');
            }

            // 密码匹配
            bcrypt.compare(password,user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            // 参数：1、规则 2、加密名字 3、过期时间 4、箭头函数
                            // 规则可以添加多个,expiresIn:3600(一小时)
                            // token:必须是Bearer +空格开头，否则验证不通过，须记住
                            const rule = {
                                id:user.id,
                                name:user.name,
                                avatar:user.avatar,
                                identity:user.identity
                            };
                            jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token) => {
                                if(err) throw err;
                                res.json({
                                    success: true, 
                                    token:'Bearer ' + token
                                })
                            })

                        }else {
                            return res.status(400).json('密码错误!');
                        }
                    })
        })
})

router.get('/current',passport.authenticate("jwt",{session:false}),(req,res) => {

    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    });
})

module.exports = router;
