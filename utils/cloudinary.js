const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.cloud_api_key,
    api_secret:process.env.cloud_api_secret
})

const uploadOnCloudinary=async (filepath )=>{
    try{
        if(!filepath)
            return null
        const result = await cloudinary.uploader.upload(filepath,{
            resource_type:"auto"
        })
        fs.unlinkSync(filepath)
        return result
    }
    catch(error)
    {
        fs.unlinkSync(filepath)
        return null
    }
} 

const deleteOnCloudindary = async(id)=>{
    try {
        if(!id)
            return null
        const deleteImage = await cloudinary.uploader.destroy(id)
        
        return deleteImage
    } catch (error) {
        return null
    }
}

module.exports = {uploadOnCloudinary, deleteOnCloudindary}