class AdminController{
    ListUser(req,res,next){
        res.render("../view/admin/ListUser")
    }
    DashBoard(req,res,next){
        res.render("../view/admin/dashboard")
    }
}

module.exports = new AdminController();