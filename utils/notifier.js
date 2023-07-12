import {APP_ID, APP_TOKEN} from "@env";
import {ajaxCall} from "./ajaxCall";

const sendNotification = async (drugName, dosing, unit, expoPushToken) => {
    await ajaxCall(
        'post',
        'v2/push/send',
        {
            body: {
                to: expoPushToken,
                sound: 'default',
                title: 'Moje-Tabsy.pl – przypominajka',
                body: `Czas przyjąć dawkę leku/suplementu ${drugName} w ilości ${dosing} ${unit}`
            },
            customApiUrl: 'https://exp.host/--'
        }
    );
};

export default sendNotification;