interface TwoStepAuthenticationContent {
    name: string;
    otp: string;
};

interface AccountCreatedContent {
    name: string;
    url: string;
};

interface AccountCreationRequest {
    name: string;
    trustName: string;
};

interface AccountRejectedContent {
    name: string;
    trustName: string;
    reason: string;
};

interface AccountAcceptedContent {
    name: string;
    trustName: string;
    url: string;
};

interface CreateOrganisationRequest {
    name: string;
    email: string;
    comments: string;
};

export {
    TwoStepAuthenticationContent,
    AccountCreatedContent,
    AccountCreationRequest,
    AccountRejectedContent,
    AccountAcceptedContent,
    CreateOrganisationRequest
};
