import {ajaxCall} from "../../utils/ajaxCall";

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({status: 200})
    }));
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

let fetchedData;
const setData = data => {
    fetchedData = data;
};

it.each`
    method
    ${'post'}
    ${'get'}
    ${'put'}
    ${'delete'}
`("should send $method request and retrieve positive information",  async ({method}) => {
    await ajaxCall(
        method,
        'some-route',
        {
            body: {
                foo: 'bar'
            },
            customApiUrl: 'https://some-url.com'
        }
    ).then(data => {
        setData(data);
    });

    expect(fetchedData).toBeTruthy();
});

it.each`
    method
    ${'post'}
    ${'get'}
    ${'put'}
    ${'delete'}
`("should throw error when $method request failed",  async ({method}) => {
    fetch.mockRejectedValueOnce(new Error('Something went wrong'));
    await ajaxCall(method, 'some-route', {body: {foo: 'bar'}}).then(data => {
        setData(data);
    });

    expect(fetchedData).toBeFalsy();
});