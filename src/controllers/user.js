import File from '../models/file_schema.js';
import User from '../models/user_schema.js';
import aws from 'aws-sdk';
import fs from 'fs';


export const signup = (req,res) => {
  aws.config.setPromisesDependency();
    aws.config.update({
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
      region: process.env.REGION
    });
    const s3 = new aws.S3();
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(req.file.path),
      Key: `documents/${req.file.originalname}`
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
      }else{
        console.log('Uplaoded Successfully');
      }

      if (data) {
        fs.unlinkSync(req.file.path); 
        const locationUrl = data.Location;

        const newFile = { ...req.body, file: locationUrl };
        const file = new File(newFile);

        try{
            await file.save();
            res.status(201).json({ message: 'User created successfully', file });
        }catch(error){
            res.status(404).json({ message : 'error occured while trying to save to DB', error});
        }
      }
    }); 
}

export const getFiles = async (req,res) => {
  try{
      const files = await File.find({});
      res.status(200).json(files);
  }catch(error){
      res.status(404).json({ message : error.message});
  }
}

export const registration = async (req,res) => {

    const result = await User.findOne({email:req.body.email});
    if(result){return res.json({status:500,message:"User exist, try with another email."})}

    const user = req.body;
    const newUser = new User(user);
    try{
        await newUser.save();
        res.status(201).json(newUser);
    }catch(error){
        res.status(404).json({ message : error.message});
    }
}

export const login = async (req,res) => {
  try{
      const user = await User.findOne({email:req.body.email, password:req.body.password});
      if(user){
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({
          status:200,
          username: user.username,
          email: user.email,
          accessToken,
          refreshToken,
          });
      }
      return res.json({status:403, message:"Login failed"});
  }catch(error){
      res.status(404).json({ message : error.message});
  }
}

  const generateAccessToken = (user) => {
   return jwt.sign({ email: user.email }, "mySecretKey", {
     expiresIn: "120m",
    });
  };

  const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, "myRefreshSecretKey");
  };


