const { EmbedBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

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

module.exports = {
    writeLogs,
    genericEmbedMessage
}