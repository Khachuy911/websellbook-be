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
    
    ListOrders(req,res,next){
        res.render("../view/admin/ListOrders")
    }
    ListVoucher(req,res,next){
        res.render("../view/admin/ListVoucher")
    }
    ListComment(req,res,next){
        res.render("../view/admin/ListComment")
    }
    ListFlashSale(req,res,next){
        res.render("../view/admin/ListFlashSale")
    }
    ListCatogery(req,res,next){
        res.render("../view/admin/ListCatogery")
    }
}

module.exports = new AdminController();