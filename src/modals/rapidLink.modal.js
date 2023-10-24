const {
    ActionRowBuilder,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
const { multiLinkDownloader } = require("../helpers/utility");

const _id_ = "rapidLinkModal";

const rapidLinkModal = (modalId = _id_) => {
    if (typeof modalId != "string" || !modalId.length) {
        throw "Modal id missing";
    }

    // Create the modal
    const modal = new ModalBuilder()
        .setCustomId(modalId)
        .setTitle("Enter Download Links!");

    // Add components to modal
    const hobbiesInput = new TextInputBuilder()
        .setCustomId("hobbiesInput")
        .setMinLength(10)
        .setRequired(true)
        .setLabel("Links should be comma(,) seperated")
        // Paragraph means multiple lines of text.
        .setStyle(TextInputStyle.Paragraph);

    const actionRow = new ActionRowBuilder().addComponents(hobbiesInput);

    // Add inputs to the modal
    modal.addComponents(actionRow);

    return modal;
};

const modalResponse = async (interaction) => {
    await interaction.deferReply();
    const { value } = interaction.fields.fields.first();
    const links = value
        ?.split("\n")
        .filter((v) => v.length > 10 && v.startsWith("http"));

    try {
        const finalLinks = await multiLinkDownloader(links);

        const msgEmb = new EmbedBuilder()
            .setTitle(`Downloader:`)
            .setTimestamp()
            .setColor(Colors.Green)
            .setFooter({ text: `requested by : ${interaction.user.id}` })
            .addFields(
                finalLinks.map((v, i) => {
                    return {
                        name: "\u200b",
                        value: `[Download your file ${i + 1}](${v})`,
                    };
                })
            );

        await interaction.followUp({ embeds: [msgEmb] });

    } catch (error) {
        interaction.followUp(
            codeBlock(error?.message || "Something wrong happend!")
        );
    }
};

module.exports = {
    modalId: _id_,
    view: rapidLinkModal,
    response: modalResponse,
};
