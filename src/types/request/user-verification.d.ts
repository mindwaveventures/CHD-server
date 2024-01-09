interface UserVerificationCreation {
  userId: string;
  otp: string;
  otpExpiry: Date;
  type: string;
}

interface UserVerificationUpdate {
  id: string;
  otp?: string;
  otpExpiry?: Date;
  token?: string;
}

export { UserVerificationCreation, UserVerificationUpdate };
