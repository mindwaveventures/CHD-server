interface UnauthorizedPaths {
    path: string,
    position?: number
};

interface EmailContent {
    to: string | string[];
    from?: string;
    subject: string;
    html: string;
};

interface SendSMS {
    recipients: string[],
    message: string
};

export {
    UnauthorizedPaths,
    EmailContent,
    SendSMS
};
