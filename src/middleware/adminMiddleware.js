const User = require('../model/userModel');


class adminMiddleWWare{

    getUser(req,res,next){
        try {
            console.log(req)
            let token = req.cookies.token
            let idUser = jwt.verify(token,process.env.JWT_SECRET_KEY).id
            const condition = {
                where: {
                  id: idUser,
                  status: !0
                }
              };
              console.log(idUser);
            User.findOne(condition)
            .then((data)=>{
                let {password,...user} =data
                res.user = user
                next()
            })
            next()
        } catch (error) {
            res.status(500).json({message:"Lỗi server"})
        }
    }
    checkAdmin(req,res,next){
        try {
            const user = req.user;
            console.log(user)
            if(user.role == 3){
                res.user = user
                next()
            }
            else{
                res.status(403).json({
                    message: "Bạn không có quyền truy cập vào trang này!"
                })
            }
        } catch (error) {
            res.status(500).json({message:"Lỗi server"})
        }
    }
}

module.exports = new adminMiddleWWare();