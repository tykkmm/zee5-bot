const mongoose = require("mongoose");
const keyValueSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const keyValueModel = mongoose.model("key_value", keyValueSchema);

const insertSingleKey = async (key, value) => {
    try {
        const res = await keyValueModel
            .findOneAndUpdate(
                { key: key },
                { value : value },
                { upsert: true }
            )
            .exec();

        return true;
    } catch (error) {
        return undefined;
    }
};


const findKey = async (key) => {
    try {
        const result = await keyValueModel
            .findOne({ key: key})
            .exec();
        if (!result) {
            return undefined;
        }
        // const {  data: } = result;
            return result;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

module.exports = {
    insertSingleKey,
    findKey,
};
