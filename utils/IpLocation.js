class IpLocation {
    static async getIpLocation() {
        let ip;
        await (await fetch('https://api.ipify.org')).text()
            .then(res => ip = res)
            .catch(err => console.log(err));

        let location;
        const ip2LocationApiKey = process.env['IP2LOCATION_API_KEY'];
        await (await fetch(`https://api.ip2location.io/?key=${ip2LocationApiKey}&ip=${ip}`)).json()
            .then(res => {
                location = {
                    city_name: res?.city_name || null,
                    country_name: res?.country_name || null,
                    ip: res?.ip || null
                };
            })
            .catch(err => console.log(err));

        return location;
    }
}

export default IpLocation;