const { EmbedBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const { default: axios } = require("axios");
const { findKey } = require("../db/keyv.mongo");
const { JSDOM } = jsdom;

let oldLogSize = 0;

const writeLogs = (filePath, logs) => {
    if (oldLogSize == logs.length) {
        return;
    }
    oldLogSize = logs.length;

    // const finalPath = path.join(filePath);
    // console.log(finalPath);
    try {
        fs.writeFile(
            filePath,
            JSON.stringify(logs),
            { flag: "w" },
            function (err) {
                if (err) {
                    console.log(err);
                    console.log(
                        `${new Date().toLocaleTimeString()} : failed to write log file.`
                    );

                    return;
                }
            }
        );
    } catch (error) {
        console.log("woops");
    }
};

const genericEmbedMessage = (messageList = [], props) => {
    const { title, descriptoin, inline, footer } = props;

    const embedMsg = new EmbedBuilder().setTitle(`${title}`).setTimestamp();
    descriptoin && embedMsg.setDescription(`${descriptoin}`);
    footer && embedMsg.setFooter(`${footer}`);
    messageList = messageList.map((v) => ({ ...v, inline: inline }));
    embedMsg.addFields(messageList);
    return embedMsg;
};

const pasteData = async (data, postUrl, viewUrl) => {
    //https://hastebin.skyra.pw/documents
    //https://www.toptal.com/developers/hastebin/api/documents'
    try {
        let str = data;
        if (typeof data != "string") {
            str = toString(data);
        }
        const response = await axios.post(postUrl, data);
        const { key } = response.data;
        return `${viewUrl}/${key}`;
    } catch (error) {
        // console.log(error.message);
        return undefined;
    }
};

const parseCookies = async () => {
    const siteURL = `https://cookies.indoviewer.com/download/udemy/`;
    try {
        const { data: rowHTML } = await axios.get(siteURL);
        const { document } = new JSDOM(rowHTML).window;
        const rawText = document.querySelector("code.language-php").textContent;
        return rawText;
    } catch (error) {
        return undefined;
    }
};

const getUdemyCookies = async () => {
    try {
        const rawText = await parseCookies();
        const postUrl = `https://hastebin.skyra.pw/documents`;
        const viewUrl = `https://hastebin.skyra.pw/raw`;
        const dataLink = await pasteData(rawText, postUrl, viewUrl);
        return dataLink;
    } catch (error) {
        return undefined;
    }
};

const restartRenderService = async () => {
    try {
        const api_url = `https://api.render.com/v1/services/srv-cihn21dgkuvojja4t7mg/restart`;
        const secret_key = process.env.render_api_key;
        const result = await axios.post(
            api_url,
            {},
            {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${secret_key}`,
                },
            }
        );
        return true;
    } catch (error) {
        // console.log(error)
        return undefined;
    }
};

const getRapidDownloadLink = async (fileLink) => {
    // console.log(ssid);
    const __user_key__ = "gator_user";
    const __pass_key__ = "gator_pass";

    const baseUrl =
        "https://dl.mobilism.org/amember/downloader/downloader/app/bindex3.php?dl=" +
        fileLink;
    const headers = {
        authority: "dl.mobilism.org",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    };

    try {
        const rapid_username = await findKey(__user_key__);
        const rapid_pass = await findKey(__pass_key__);

        if (!rapid_pass || !rapid_username) {
            throw new Error("Username / password not found!");
        }
        const { data } = await axios.post(
            baseUrl,
            new URLSearchParams({
                username: rapid_username.value,
                password: rapid_pass.value,
            }),
            { headers: headers }
        );

        const searchStr = `URL=https://mblservices.org/amember/downloader/downloader/app/files`;
        const idx = data.indexOf(searchStr);
        if (idx >= 0) {
            const last_idx = data.indexOf('"', idx + 10);
            return data.slice(idx, last_idx).split("=").pop();
        }
    } catch (error) {
        return undefined;
    }
};
module.exports = {
    writeLogs,
    genericEmbedMessage,
    getUdemyCookies,
    restartRenderService,
    getRapidDownloadLink,
};
