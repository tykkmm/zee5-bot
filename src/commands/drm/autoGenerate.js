const { default: axios } = require("axios");
const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
const { insertKey } = require("../../db/udemy.keys.model");
const { renderkey } = require("../../helpers/drm.helper");
const { addCourseInfo, getCourseInfo, deleteMultiInfo } = require("../../db/udemy.course.info");

// const renderkey = async (pssh, lic_url) => {
//     // const postUrl = prov;
//     const postUrl = `${process.env.API_URL}/licence`;
//     const lic_data = JSON.stringify({
//         pssh: pssh,
//         lic_url: lic_url,
//     });
//     try {
//         const axr = await axios.post(postUrl, lic_data, {
//             headers: {
//                 "X-API-Key": process.env.API_KEY,
//                 "Content-Type": "application/json",
//             },
//         });
//         const data = axr.data;
//         return data;
//     } catch (error) {
//         // console.log(error);
//         return { status: "error", error: error.message };
//     }
// };

module.exports = {
    // renderkey,
    data: new SlashCommandBuilder()
        .setName("auto-gen")
        .setDescription("auto generate udemy keys!")
        .addStringOption((lic) => {
            return lic
                .setName("licence_url")
                .setDescription("video licence url")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();

        const psshAr =await getCourseInfo(15);
        // console.log('pssh array = ',psshAr);
        const _lic_url = interaction.options.getString("licence_url");
        const dlAr = [];
        if(Array.isArray(psshAr)){
            let cnt = 0;
            for(let i =0 ;i <psshAr.length;i++){
                const _pssh = psshAr[i].pssh;

                let lice_data = await renderkey(_pssh, _lic_url);
                
                // console.log(`file: autoGenerate.js:57 ~ lice_data:`, lice_data);
                
                const { status ,wv} = lice_data;
                const keydata = typeof wv == "string" ? JSON.parse(wv) : wv;
                
                if(status!='error' && keydata.result?.length){
                    // console.log('keydata=',keydata);
                    const {  result } = keydata;
                    dlAr.push(psshAr[i]);
                    insertKey(_pssh,result);
                    cnt++;
                }
            }
            deleteMultiInfo(dlAr);
            await interaction.followUp({ content :`successfully generated ${cnt} keys out of ${psshAr.length}` });

        }else{
            await interaction.followUp({ content :"nothing found!" });
        }
    },
};
