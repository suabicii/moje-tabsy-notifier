import IpLocation from "../../utils/IpLocation";
import location from "../fixtures/location";

const mockIp = '127.0.0.1';

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

it('should get IP location', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(location),
        text: () => Promise.resolve(mockIp)
    }))

    const fetchedLocation = await IpLocation.getIpLocation();

    expect(fetchedLocation).toEqual(location);
});

it('should get error if getting IP failed', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.reject('Cannot get location'),
        text: () => Promise.reject('Cannot get IP')
    }));

    const fetchedLocation = await IpLocation.getIpLocation();

    expect(fetchedLocation).toBe(undefined);
}); 