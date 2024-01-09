import {
    TwoStepAuthenticationContent,
    AccountCreatedContent,
    AccountCreationRequest,
    AccountRejectedContent,
    AccountAcceptedContent,
    CreateOrganisationRequest
} from '../types/templates';
import { Utilities } from '../helpers';
import { containerNames } from '../constants';

const { capitalizeLetters } = Utilities;

const commonContent = `
    Please note, this platform is still under development, and we welcome feedback. If you have questions or
    feedback not related to your direct delivery of care from your clinicians, please email
    datascientists@alderhey.nhs.uk.
`;

const twoStepAuthenticationContent = ({ name, otp }: TwoStepAuthenticationContent): string => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Two step authentication to their WNB.<br>
                Your OTP is ${otp}<br><br>
                        ${commonContent}
            </p>
        </html>
    `
};

const accountCreated = ({ name, url }: AccountCreatedContent): string => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your account created successfully on WNB.<br><br>
                    Click on the link to activate your account <a href=${url}>${url}</a>
                ${commonContent}
            </p>
        </html>
    `;
};

const accountCreationRequested = ({ name, trustName }: AccountCreationRequest): string => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your Request for the creation of Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been submitted successfully. Once your requested is accepeted/rejected you can get the response mail<br><br>
                        ${commonContent}
            </p>
        </html>
    `;
};

const accountRejected = ({ name, trustName, reason }: AccountRejectedContent): string => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your Request for the creation of Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been rejected with a reason of ${reason}.<br><br>
                        ${commonContent}
            </p>
        </html>
    `;
};

const accountAccepeted = ({ name, trustName, url }: AccountAcceptedContent): string => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your Request for the creation of Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been Accepted.<br><br>
                    Now you can sign in to our portal and continue with our WNB tool <a href=${url}>${url}</a>.<br><br>
                        ${commonContent}
            </p>
        </html>
    `;
};

const userCreationRequest = ({ name, trustName }: AccountCreationRequest): string => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your Request to the Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been Submitted Successfully. Once the request is accepeted/rejected by trust/organisation you will get the response mail<br><br>
                        ${commonContent}
            </p>
        </html>
    `;
};

const userRejected = ({ name, trustName, reason }: AccountRejectedContent) => {
    return `
    <html>
        <p>
            Dear ${capitalizeLetters(name)} <br><br>
                Your Request to the Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been Rejected with a reason ${reason}.<br><br>
                    ${commonContent}
        </p>
    </html>
`;
};

const userAccepted = ({ name, trustName, url }: AccountAcceptedContent) => {
    return `
    <html>
        <p>
            Dear ${capitalizeLetters(name)} <br><br>
                Your Request to the Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been Accepted.<br><br>
                Now you can sign in to our portal and continue with our WNB tool <a href=${url}>${url}</a>.<br><br>    
                ${commonContent}
        </p>
    </html>
`;
};

const organisationRequestAccepeted = ({ name, trustName, url }: AccountAcceptedContent) => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your Request to create a Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been Accepted.<br><br>
                    Now you can sign in to our portal and continue with our WNB tool <a href=${url}>${url}<a>.<br><br>    
                    ${commonContent}
            </p>
        </html> 
    `;
};

const organisationRequestRejected = ({ name, trustName, reason }: AccountRejectedContent) => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your Request to create a Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been Rejected with a reason ${reason}.<br><br>
                    ${commonContent}
            </p>
        </html> 
`;
};

const userPromoted = ({ name, trustName }: AccountCreationRequest) => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                    Your role on Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been promoted to Admin.<br><br>
                    ${commonContent}
            </p>
        </html> 
    `;
};

const userDepromoted = ({ name, trustName }: AccountCreationRequest) => {
    return `
        <html>
            <p>
                Dear ${capitalizeLetters(name)} <br><br>
                Your role on Trust/Organisation ${capitalizeLetters(trustName)} in WNB has been depromoted from Admin.<br><br>
                    ${commonContent}
            </p>
        </html> 
    `;
};

const requestForCreatingOrganisation = ({
    name,
    email,
    comments
}: CreateOrganisationRequest) => {
    return `
        <html>
            <p>
                Hi Alder Hey team,<br>
                My name is <b>${name}</b> and email is <b>${email}</b><br>
                <b>${comments}</b><br><br>
                ${commonContent}
            </p>
        </html> 
    `;
};

const predictionCompleted = (name: string, status: string, type: string) => {
    return `
        <html>
            <p>
                Hi ${name} from WNB prediction tool,<br />
                Your last ${type} upload was ${status}<br><br>
                ${type === containerNames.future ? 'You can download the prediction now.<br><br>' : ''}
                ${commonContent}
            </p>
        </html>
    `;
};

const forgotPasswordResendOTP = (name: string, otp: string) => {
    return `
    <html>
        <p>
            Dear ${capitalizeLetters(name)} <br><br>
               Your OTP for forgot password is ${otp}<br><br>
                ${commonContent}
        </p>
    </html> 
`;
};

const organisationArchived = (name: string) => {
    return `
        <html>
            <p>
                Hi ${capitalizeLetters(name)} <br><br>
                Your organisation has been archived<br><br>
                    ${commonContent}
            </p>
        </html> 
    `;
};

const organisationUnArchieved = (name: string) => {
    return `
    <html>
        <p>
            Hi ${capitalizeLetters(name)} <br><br>
            Your organisation has been unarchived<br><br>
                ${commonContent}
        </p>
    </html> 
`;
};

export {
    twoStepAuthenticationContent,
    accountCreated,
    accountCreationRequested,
    accountRejected,
    accountAccepeted,
    userCreationRequest,
    userAccepted,
    userRejected,
    organisationRequestAccepeted,
    organisationRequestRejected,
    userPromoted,
    userDepromoted,
    requestForCreatingOrganisation,
    predictionCompleted,
    forgotPasswordResendOTP,
    organisationArchived,
    organisationUnArchieved
};
