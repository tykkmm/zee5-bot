const { default: axios } = require("axios");

const renderkey = async (pssh, lic_url) => {
    // const postUrl = prov;
    const postUrl = `${process.env.API_URL}/licence`;
    const lic_data = JSON.stringify({
        pssh: pssh,
        lic_url: lic_url,
    });
    try {
        const axr = await axios.post(postUrl, lic_data, {
            headers: {
                "X-API-Key": process.env.API_KEY,
                "Content-Type": "application/json",
            },
        });
        const data = axr.data;
        return data;
    } catch (error) {
        // console.log(error);
        return { status: "error", error: error.message };
    }
};
const testCdm = async (cdmName)=>{
    const postUrl = `${process.env.API_URL}/test`;
    const lic_data = JSON.stringify({
        cdm:cdmName
    });
    try {
        const axr = await axios.post(postUrl, lic_data, {
            headers: {
                "X-API-Key": process.env.API_KEY,
                "Content-Type": "application/json",
            },
        });
        const data = axr.data;
        return data;
    } catch (error) {
        // console.log(error);
        return { status: "error", error: error.message };
    }
}

const hoichoiKey = async (pssh, token) => {
    // const postUrl = prov;
    const postUrl = `${process.env.API_URL}/hoichoi`;
    const requestData = JSON.stringify({
        pssh: pssh,
        lic_url: "https://drm-widevine-licensing.axprod.net/AcquireLicense",
        token : token
    });
    try {
        const axr = await axios.post(postUrl, requestData, {
            headers: {
                "X-API-Key": process.env.API_KEY,
                "Content-Type": "application/json",
            },
        });
        const data = axr.data;
        return data;
    } catch (error) {
        // console.log(error);
        return { status: "error", error: error.message };
    }
};

module.exports = {
    renderkey,testCdm,hoichoiKey
}