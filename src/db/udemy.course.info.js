const mongoose = require("mongoose");

const courseDRMinfo = new mongoose.Schema(
    {
        pssh: {
            type: String,
            unique: true,
            required: true,
        },
        courseid: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            unique: true,
            required: true,
        },
        source: {
            type: String,
            unique: true,
            required: true,
        },
        user:{
            type:String,
            required:true
        },
        generated : Boolean
        
    },
    {
        timestamps: true,
    }
);
const drmInfoModel = mongoose.model("udemy-course-info", courseDRMinfo);

const addCourseInfo = async (data) => {
    if (data) {
        const { pssh, source, title, courseid ,user} = data;
        if(!pssh || !source || !title || !courseid){
            return {error : ['data is missing']};
        }
        try {
            const res = await drmInfoModel
                .findOneAndUpdate(
                    { pssh: pssh },
                    { pssh, source, title, courseid ,user},
                    { upsert: true }
                )
                .exec();
            return { message: "data added!" };
        } catch (error) {
            return { error: [error.message] };
        }
    } else {
        return { error: ["there is no data!"] };
    }
};

const countCourseData = async () => {
    try {
        const cnt = await drmInfoModel.countDocuments();
        // console.log(cnt);
        return cnt;
    } catch (error) {
        return 0;
    }
};

const getCourseInfo = async (_limit=3)=>{
    try {
        const tst = await drmInfoModel.find({}).limit(_limit).exec();
        return tst;
    } catch (error) {
        return [];
    }
};

const deleteMultiInfo = async (multiInfo)=>{
    if(Array.isArray(multiInfo)){
        for(let i = 0 ;i<multiInfo.length;i++){
            await deleteCourseInfo(multiInfo[i].pssh);
        }
        return true;
    }else{
        return false;
    }
};
const deleteCourseInfo = async (pssh) => {
    if (pssh) {
        try {
            const res = await drmInfoModel
                .findOneAndDelete({ pssh: pssh })
                .exec();
            return { message: "data deleted=" + res.pssh };
        } catch (error) {
            return { error: [error.message] };
        }
    } else {
        return { error: ["there is no pssh!"] };
    }
};

module.exports = {
    addCourseInfo,
    countCourseData,
    deleteCourseInfo,
    getCourseInfo,
    deleteMultiInfo
};
