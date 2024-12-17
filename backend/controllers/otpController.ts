import Otp from "../models/Otp";
import User from "../models/User";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.GMAIL,
		pass: process.env.APP_PASSWORD,
	},
});

const generateOTP = (): string =>
	Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req: any, res: any) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		const otpCode = generateOTP();

		await Otp.findOneAndDelete({ email });
		const otpDoc = new Otp({ email, otp: otpCode });
		await otpDoc.save();

		const mailOptions = {
			from: process.env.GMAIL,
			to: email,
			subject: "Password Reset OTP",
			text: `Your OTP for password reset is: ${otpCode}. This OTP will expire in 5 minutes.`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "OTP sent to your email address." });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Failed to send OTP. Try again later.",
		});
	}
};

export const verifyOtp = async (req: any, res: any) => {
	try {
		const { email, otp } = req.body;

		const otpRecord = await Otp.findOne({ email, otp });
		if (!otpRecord) {
			return res.status(400).json({ message: "Invalid or expired OTP." });
		}

		await Otp.findOneAndDelete({ email });

		res.status(200).json({ message: "OTP verified successfully." });
	} catch (error) {
		res.status(500).json({ message: "Failed to verify OTP." });
	}
};

export const setNewPassword = async (req: any, res: any) => {
	try {
		const { email, newPassword } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}
		await User.findOneAndUpdate({ email }, { password: newPassword });

		res.status(200).json({ message: "Password updated successfully." });
	} catch (error) {
		res.status(500).json({ message: "Failed to update password." });
	}
};
