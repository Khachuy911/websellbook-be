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
    ListOrders(req,res,next){
        res.render("../view/admin/ListOrders")
    }
    ListVoucher(req,res,next){
        res.render("../view/admin/ListVoucher")
    }
}

module.exports = new AdminController();