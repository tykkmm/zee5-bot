const mongoose = require("mongoose");
const keySchema = new mongoose.Schema(
    {
        pssh: {
            type: String,
            required: true,
            unique: true,
        },
        kid_key: {
            type: Array,
            of: String,
            required: true,
        },
        licence_url: String,
    },
    {
        timestamps: true,
    }
);

const keysModel = mongoose.model("keys", keySchema);

const insertSingleKey = async (pssh, kidey) => {
    try {
        const res = await keysModel
            .findOneAndUpdate(
                { pssh: pssh },
                { $addToSet: { kid_key: kidey } },
                { upsert: true }
            )
            .exec();

        return true;
    } catch (error) {
        return undefined;
    }
};

const insertMultipleKey = async (pssh, key_list) => {
    try {
        const oldList = await keysModel
            .findOne({ pssh: pssh }, { kid_key: 1, _id: 0 })
            .exec();
        // console.log(`old=`,oldList);
        if (!oldList) {
            // not found
            const key_set = new Set(key_list);
            const entry = new keysModel({
                pssh: pssh,
                kid_key: Array.from(key_set),
            });
            await entry.save();
            return true;
        } else {
            let new_list = new Set([...oldList.kid_key,...key_list]);
            new_list = Array.from(new_list);
            // console.log('newlist=',new_list);
            await keysModel
                .updateOne(
                    { pssh: pssh },
                    {
                        $set: { kid_key: new_list },
                    }
                )
                .exec();

            return true;
        }
    } catch (error) {
        return undefined;
    }
};

const insertKey = async (pssh, keys) => {
    if (Array.isArray(keys)) {
        if (keys.length > 1) {
            let res = await insertMultipleKey(pssh, keys);
            return res;
        } else {
            keys = keys.pop();
        }
    }
    if (typeof keys == "string") {
        const res = await insertSingleKey(pssh, keys);
        return res;
    }
};

const findKeyByPssh = async (pssh) => {
    try {
        const result = await keysModel
            .findOne({ pssh: pssh }, { kid_key: 1, _id: 0 })
            .exec();
        if (!result) {
            return undefined;
        }
        const { kid_key: data } = result;

        if (data.length) {
            return data;
        }
        return undefined;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

module.exports = {
    insertKey,
    findKeyByPssh,
};
