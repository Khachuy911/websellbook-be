class AdminController{
    ListUser(req,res,next){
        res.render("../view/admin/ListUser")
    }
}

module.exports = new AdminController();