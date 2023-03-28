
const jwt = require('jsonwebtoken');

const User = require('../model/userModel');


class adminMiddleWWare{

    getUser(req,res,next){
        try {
            let token = req.cookies.token
            let idUser = jwt.verify(token,process.env.JWT_SECRET_KEY).id
            const condition = {
                where: {
                  id: idUser,
                  status: 1
                }
            };

            User.findOne(condition)
            .then((data)=>{
                let {password,...user} =data.dataValues
                res.data = user
                next()
            })
            next()
        } catch (error) {
            res.status(500).json({message:"Lỗi server"})
        }
    }
    checkAdmin(req,res,next){
        try {
            console.log(req.data)
            next();
        } catch (error) {
            res.status(500).json({message:"Lỗi server"})
        }
    }
}

module.exports = new adminMiddleWWare();