import { addField } from "./functions/pdf_functions";

const init = async () => {
    await addField();
};

init().catch((error) => {
    console.error(error);
    process.exit(1);
});
