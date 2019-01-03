const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const passport = require('passport');

router.get('/test', (req, res) => {
    console.log('profile works!');
})

//创建信息接口
router.post('/add', passport.authenticate("jwt", {session: false}), (req, res) => {
    const profileFields = {};
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.type = req.body.remark;

    new Profile(profileFields).save().then(profile => {
        res.json(profile);
    })
})

// 获取所有信息
router.get('/',passport.authenticate("jwt", {session: false}),(req,res) => {
    Profile.find()
        .then(profile => {
            if(!profile) {
                res.status(404).json('没有任何内容');
            }
            res.json(profile);
        })
        .catch(err => {
            res.status(404).json(err);
        }) 
})

//获取单个信息
router.get('/:id',passport.authenticate("jwt", {session: false}),(req,res) => {
    Profile.findOne({_id:req.params.id})
        .then(profile => {
            if(!profile) {
                res.status(404).json('没有任何内容');
            }
            res.json(profile);
        })
        .catch(err => {
            res.status(404).json(err);
        }) 
})

module.exports = router;