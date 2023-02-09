import {APP_ID, APP_TOKEN} from "@env";
import {ajaxCall} from "./ajaxCall";

export default async (drugName, dosing, unit, userId) => {
    await ajaxCall(
        'post',
        'indie/notification',
        {
            body: {
                subID: userId,
                appId: APP_ID,
                appToken: APP_TOKEN,
                title: 'Moje-Tabsy.pl – przypominajka',
                message: `Czas przyjąć dawkę leku/suplementu ${drugName} w ilości ${dosing} ${unit}`
            },
            customApiUrl: 'https://app.nativenotify.com'
        }
    );
};