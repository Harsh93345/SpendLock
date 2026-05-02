import {v2 as cloudinary} from "cloudinary"; 
import fs from "fs"//file system module to delete the file after uploading to cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) =>
{
    try{ 
        if(!localFilePath) return null;
        const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        console.log("file is uploaded to cloudinary",response.url);
        return response;
    }catch(error)
    {
        fs.unlinkSync(localFilePath);//remove the locally saved temprory file as the upload operation got failed
    }
}