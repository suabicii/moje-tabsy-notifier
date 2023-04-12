import sendNotification from "../../utils/notifier";
import {drugList} from "../fixtures/drugList";

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({status: 200})
    }));
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

it('should send push notification', () => {
    const drug = drugList[0];

    sendNotification(drug.name, drug.dosing, drug.unit, 'john@doe.com');

    expect(global.fetch).toBeCalled();
});