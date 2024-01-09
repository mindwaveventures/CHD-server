import initMessageBird from 'messagebird';
import appConfig from '../app-config';
import { Custom } from '../types';

const messageBird = initMessageBird(appConfig.messageBirdKey);

const sendSingleOrBulkMail = ({
    recipients,
    message
}: Custom.SendSMS) => {
    const params = {
        'originator': 'AHWNB',
        'recipients': recipients,
        'body': message
    };
    return messageBird.messages.create(params, (err, response) => {
        if (err) {
            console.log(err);
        }
    });
};

export default {
    sendSingleOrBulkMail
};
