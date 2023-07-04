const { EmbedBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const jsdom = require("jsdom");
const { default: axios } = require('axios');
const { JSDOM } = jsdom;

let oldLogSize = 0;

const writeLogs = (filePath,logs)=>{
     
    if(oldLogSize == logs.length){
        return ;
    }
    oldLogSize = logs.length;

    // const finalPath = path.join(filePath);
    // console.log(finalPath);
    try {
        fs.writeFile(filePath, JSON.stringify(logs), {flag: 'w'}, function(err) {
            if (err) {
                console.log(err)
                console.log(`${new Date().toLocaleTimeString()} : failed to write log file.`);

                return ;
            }
        });
    } catch (error) {
        console.log('woops');
    }

}

const genericEmbedMessage = (messageList=[],props)=>{

    const {title,descriptoin,inline,footer} = props;

    const embedMsg = new EmbedBuilder()
                        .setTitle(`${title}`)
                        .setTimestamp();
    (descriptoin && embedMsg.setDescription(`${descriptoin}`));
    (footer && embedMsg.setFooter(`${footer}`));
    messageList = messageList.map(v => ({...v,inline:inline}));
    embedMsg.addFields(messageList);
    return embedMsg;
}

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

const getUdemyCookies = async ()=>{
    try {
        const rawText =await parseCookies();
        const postUrl = `https://hastebin.skyra.pw/documents`;
        const viewUrl = `https://hastebin.skyra.pw/raw`;
        const dataLink = await pasteData(rawText,postUrl,viewUrl);
        return dataLink;
    } catch (error) {
        return undefined;
    }
}

module.exports = {
    writeLogs,
    genericEmbedMessage,
    getUdemyCookies
}