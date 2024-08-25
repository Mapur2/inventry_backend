const User = require('../models/user.model')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')
const { uploadOnCloudinary, deleteOnCloudindary } = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')
const Product = require("../models/product.model")
const puppeteer = require('puppeteer');
const path = require('path');

const insertProduct = asyncHandler(async (req, res) => {
    const { name, price, quantity, unitType } = req.body
    const imagePath = req.file?.path

    const userId = req.user._id

    // console.log(req.body,imagePath)

    if (!name || !price || !quantity || !unitType || !imagePath)
        throw new ApiError(400, "All fields are required")

    if ([name, price, quantity, unitType, imagePath].some((f) => f.trim() === ""))
        throw new ApiError(400, "All fields are required")

    const image = await uploadOnCloudinary(imagePath)
    if (!image)
        throw new ApiError(409, "Please upload a product image")

    const product = await Product.create({
        name,
        price,
        quantity,
        unitType,
        image: image.url,
        imageId: image.public_id,
        userId: userId
    })

    const createdProduct = await Product.findById(product._id)
    if (!createdProduct)
        throw new ApiError(500, "Something went wrong while creating the product")

    return res.status(201).json(
        new ApiResponse(200, createdProduct, "Product created successfully")
    )

})

const getProducts = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const products = await Product.find({
        userId
    }).sort({ updatedAt: -1 })

    if (!products || products.length == 0)
        throw new ApiError(400, "No Products found")

    return res.status(202)
        .json(new ApiResponse(202, products, "All products successfully retrieved"))
})

const getProduct = asyncHandler(async (req, res) => {

    const { id } = req.query
    const product = await Product.findById(id)

    if (!product)
        throw new ApiError(400, "No Products found")

    return res.status(202)
        .json(new ApiResponse(202, product, "Product successfully retrieved"))
})

const updateProduct = asyncHandler(async (req, res) => {
    const {
        id,
        name,
        price,
        quantity,
        unitType, } = req.body
    if (!name || !price || !quantity || !unitType)
        throw new ApiError(400, "Enter all Fields")
    const product = await Product.findByIdAndUpdate({ _id: id }, {
        name,
        price,
        quantity,
        unitType,
    },
        {
            new: true
        })

    if (!product)
        throw new ApiError(500, "Could not update product")

    return res.status(202)
        .json(new ApiResponse(202, product, "Product successfully updated"))
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.query

    const product = await Product.findById(id)
    if (!product)
        throw new ApiError(400, "Could not find product")

    const deleteImage = await deleteOnCloudindary(product.imageId)
    if (!deleteImage)
        throw new ApiError(500, "Could delete product as something went wrong during deleting the image")

    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct)
        throw new ApiError(500, "Could not delete product")

    return res.status(202)
        .json(new ApiResponse(202, product, "Product successfully deleted"))
})

const getBill = asyncHandler(async (req, res) => {
    const user = req.user
    const items = req.body
    for (let i = 0; i < items.length; i++) {
        const ele = items[i];
        const product = await Product.findById({ _id: ele.id })

        if (!product)
            throw new ApiError(500, "Could not find a product")
        const updateProduct = await Product.findByIdAndUpdate({ _id: ele.id }, {
            quantity: product.quantity - ele.count
        },
            {
                new: true
            }
        )

        if (!updateProduct)
            throw new ApiError(500, "Could not update a product")
    }
    return res.json(new ApiResponse(202, "ok"))
})



/**
 * Not required
 */
const getPDF = asyncHandler(async (req, res) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(`${req.protocol}://${req.get('host')}/api/v1/users/bill`, {
        waitUntil: "networkidle2"
    })
    await page.setViewport({ width: 1500, height: 1050 })
    const pdf = await page.pdf({
        path: `${path.join(__dirname, '../public/temp', "invoice.pdf")}`,
        format: "A4"
    })

    await browser.close()

    const pdfURL = path.join(__dirname, '../public/temp', "invoice.pdf")

    res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length
    }).sendFile(pdfURL)

})

module.exports = { insertProduct, getProducts, getProduct, updateProduct, deleteProduct, getBill, getPDF }