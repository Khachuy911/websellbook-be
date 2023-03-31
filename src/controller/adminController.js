class AdminController{
    ListUser(req,res,next){
        res.render("../view/admin/ListUser")
    }
    ListProduct(req,res,next){
        res.render("../view/admin/listProduct")
    }
    DashBoard(req,res,next){
        res.render("../view/admin/dashboard")
    }
    User(req,res,next){
        res.render("../view/admin/user")
    }
}

module.exports = new AdminController();