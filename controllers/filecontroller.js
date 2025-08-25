import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import File from "../models/file.js";
import transporter from "../config/nodemailer.js";


const storage = multer.diskStorage({});
export const upload = multer({ storage });

export const uploadFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    const file = await File.create({
      filename: req.file.originalname,
      fileURL: result.secure_url,
      uploadedBy: req.user.id,
      expiryTime,
    });

    const downloadLink = `${process.env.BASE_URL}/api/files/download/${file._id}`;

    // Send email 
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: "Your File Download Link",
      html: `<p>Click <a href="${downloadLink}">here</a> to download your file. Link expires in 1 hour.</p>`,
    });

    res.status(201).json({ message: "File uploaded successfully", downloadLink });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "File not found" });

    if (Date.now() > file.expiryTime) return res.status(403).json({ message: "Link expired" });

    file.downloadCount += 1;
    await file.save();

    res.redirect(file.fileURL);
  } catch (error) {
    res.status(500).json({ message: "Download failed", error });
  }
};
