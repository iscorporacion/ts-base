import { PdfSigner, } from "sign-pdf-lib";
import *  as fs from "fs";
import * as path from "path";

const sign = async () => {
    const pdfFile = fs.readFileSync(path.resolve(__dirname, "../", "signed.pdf"));
    const p12File = fs.readFileSync(path.resolve(__dirname, "../", "certificate_iscorporacion.p12"));
    const imgFirma = fs.readFileSync(path.resolve(__dirname, "../", "firma2.png"));
    const p12Password = "T01234i56789m";
    const pdfSigner = new PdfSigner({
        rangePlaceHolder: 20000,
        signatureLength: 8192,
        signatureComputer: {
            certificate: p12File,
            password: p12Password,
        }
    });

    const pdfOutput = await pdfSigner.signAsync(pdfFile, {
        pageNumber: 1,
        name: "taylor0188",
        signature: {
            contactInfo: "soporte@orbysgroup.com",
            date: new Date(),
            location: "Colombia",
            reason: "Firma de contrato",
            name: "Taylor Mosquera Castro",
        },
        visual: {
            background: imgFirma,
            rectangle: {
                left: 300, // 200 diff 164
                top: 641,
                right: 464, // 264
                bottom: 711
            },
            texts: [
                {
                    lines: [
                        "JOHN",
                        "DOE"
                    ]
                }, {
                    lines: [
                        "Digitally signed by",
                        "TAYLOR MOSQUERA CASTRO",
                        "Date: 2023.11.03",
                        "20:28:46 +02\"00\""
                    ]
                }
            ],

        }
    });
    const outputPdfPath = path.resolve(__dirname, "../", "signed_three.pdf");
    fs.writeFileSync(outputPdfPath, pdfOutput);
    console.log("File signed and saved at: ", outputPdfPath);
};



type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8| 9 | 10;
type PosicionFirma = {
    column: 1 | 2 | 3;
    row: Row
    type?: "letter" | "legal";
};

/**
 * Calcula las posiciones de una firma en un documento PDF.
 */
const positionSignature = ({column, row, type = "letter"}: PosicionFirma) => { 
    let totalRow:Row  = 8;
    if (type === "legal") {
        totalRow = 10;
    }
    if (type === "letter") {
        totalRow = 8;
    }
    if (column < 1) column = 1;
    if (column > 3) column = 3;
    if (row < 1) row = 1;
    if (row > totalRow) row = totalRow;
    
    // Posiciones iniciales
    const startColumn = 50;
    const endColumn = 214;
    const startRow = 50;
    const endRow = 120;

    // Incrementos
    const columnIncrement = 180;
    const rowIncrement = 90;


    // Calcula las posiciones
    const left = startColumn + (columnIncrement * (column - 1));
    const right = endColumn + (columnIncrement * (column - 1));
    const top = startRow + (rowIncrement * (row - 1));
    const bottom = endRow + (rowIncrement * (row - 1));

    // Retorna el objeto con las posiciones
    return { top, bottom, left, right };
};
const addField = async () => {
    const pdfFile = fs.readFileSync(path.resolve(__dirname, "../", "field_signed.pdf"));
    const p12File = fs.readFileSync(path.resolve(__dirname, "../", "certificate_iscorporacion.p12"));
    const { top, bottom, left, right } = positionSignature({ row: 8, column: 2 });
    const p12Password = "T01234i56789m";
    const pdfSigner = new PdfSigner({
        rangePlaceHolder: 20000,
        signatureLength: 8192,
        signatureComputer: {
            certificate: p12File,
            password: p12Password,
        }
    });
    const otro = await pdfSigner.addFieldAsync(pdfFile, {
        pageNumber: 1,
        name: "taylor01",
        rectangle: {
            left, // 15 - 195 - 375
            top,
            right, // 179 - 359 - 539
            bottom
        },
    });
    const outputPdfPath = path.resolve(__dirname, "../", "field_1.pdf");
    fs.writeFileSync(outputPdfPath, otro);
    console.log("File signed and saved at: ", outputPdfPath);
};

const addSignatureToField = async () => {
    const pdfFile = fs.readFileSync(path.resolve(__dirname, "../", "field_1.pdf"));
    const p12File = fs.readFileSync(path.resolve(__dirname, "../", "certificate_iscorporacion.p12"));
    const imgFirma = fs.readFileSync(path.resolve(__dirname, "../", "container_firmas.png"));//250*105
    const p12Password = "T01234i56789m";

    const pdfSigner = new PdfSigner({
        rangePlaceHolder: 200000,
        signatureLength: 8192,
        signatureComputer: {
            certificate: p12File,
            password: p12Password,
        }
    });

    const pdfOutput = await pdfSigner.signFieldAsync(pdfFile, {
        fieldName: "taylor01",
        signature: {
            contactInfo: "soporte@orbysgroup.com",
            date: new Date(),
            location: "Colombia",
            reason: "Firma de contrato",
            name: "Taylor Mosquera Castro",
        },
        visual: {
            background: imgFirma,
        }
    });
    const outputPdfPath = path.resolve(__dirname, "../", "field_signed.pdf");
    fs.writeFileSync(outputPdfPath, pdfOutput);
    console.log("File signed and saved at: ", outputPdfPath);
};

const verifySignature = async () => {
    const pdfFile = fs.readFileSync(path.resolve(__dirname, "../", "field_signed.pdf"));
    const p12File = fs.readFileSync(path.resolve(__dirname, "../", "certificate_yoanaarrubla.p12"));
    const p12Password = "Y01234i56789m";
    const pdfSigner = new PdfSigner({
        rangePlaceHolder: 20000,
        signatureLength: 8192,
        signatureComputer: {
            certificate: p12File,
            password: p12Password
        }
    });
    const pdfOutput = await pdfSigner.verifySignaturesAsync(pdfFile);
    console.log(JSON.stringify(pdfOutput, null, 2));

};

export { sign, addField, addSignatureToField, verifySignature };