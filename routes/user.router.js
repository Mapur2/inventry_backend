const express = require('express');
const { registerUser, loginUser, createBusiness } = require('../controllers/user.controller');
const {insertProduct, getProducts, getProduct, updateProduct, deleteProduct} = require("../controllers/products.controller.js")
const verifyJWT = require("../middleware/verifyJWT.js")
const router = express.Router()
const upload = require("../middleware/multer.js");
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)
router.route("/").get(asyncHandler( (req,res)=>{
    return res.status(200).json(new ApiResponse(200,{},"Welcome User"))
}))
//secured routes
router.route("/createbusy").post(verifyJWT,createBusiness)
router.route("/addproduct").post(verifyJWT,upload.single('image'),insertProduct)
router.route("/getallproducts").get(verifyJWT,getProducts)
router.route("/product").get(verifyJWT,getProduct)
router.route("/updateproduct").post(verifyJWT,updateProduct)
router.route("/deleteproduct").get(verifyJWT, deleteProduct)

module.exports = router
