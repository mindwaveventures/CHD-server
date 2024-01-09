const OTPSMSContent = (code: string) => {
    return `
        Your One time password(OTP) is ${code}
    `;
};

export {
    OTPSMSContent
};
