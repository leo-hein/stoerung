const nReadlines = require("n-readlines");
const path = require("path");
const fs = require("fs");

const book = new nReadlines(
    path.resolve(__dirname, "resources/Alice_im_Wunderland.txt")
);
const stoerungsdateipfade = [
    "stoerung1.txt",
    "stoerung2.txt",
    "stoerung3.txt",
    "stoerung4.txt",
    "stoerung5.txt",
];
let lueckensaetze = [];
let volltext = "";

let line;
let lineNumber = 1;

while ((line = book.next())) {
    volltext += line;
    lineNumber++;
}

const saetze = volltext.split(".");
// console.log(saetze);

lueckensaetze = stoerungsdateipfade.map((pfad) => {
    const text = new nReadlines(path.resolve(__dirname, "resources/" + pfad));
    let lueckensatz = "";
    let line;

    while ((line = text.next())) {
        lueckensatz += line;
    }
    return lueckensatz;
});

// console.log(lueckensaetze);

let lueckensaetzeInEinzelwoertern = lueckensaetze.map((satz) => {
    const woerter = [...satz.matchAll(/([a-zäöüßA-ZÄÖÜ]+)/g)].map(
        (match) => match[0]
    );
    return woerter;
});

// let reg =  new RegExp("\\b" + "this" + "\\b") + "i";
// console.log(reg);
// lueckensaetzeInEinzelwoertern.forEach((satz) => console.log(satz));
// saetze.forEach(satz => console.log(satz.includes("_")));

const alleMatches = holeMatchesZuAllenLueckenSaetzen(
    saetze,
    lueckensaetzeInEinzelwoertern
);

// alleMatches.forEach(match => console.log(match));

const re = new RegExp("wollen") + "i";
console.log(re);
console.log(re.test("Wollen Sie mir sagen..."));

function isMatch(vollsatz, lueckensatz) {
    
    // console.log(
    //     lueckensatz.every((wort) => {
    //         const re = new RegExp("\\b" + wort + "\\b") + "i";
    //         console.log(re);
    //         vollsatz.includes(re);
    //     })
    // );
    return lueckensatz.every((wort) => {
        const re = new RegExp("\\b" + wort + "\\b") + "i";
        // console.log(wort, vollsatz.includes(re));
        return vollsatz.includes(re);
    });
}

function findeUebereinstimmendeSaetze(vollsaetze, lueckenSatzInEinzelwoertern) {
    return vollsaetze.filter((vollsatz) => {
        return isMatch(vollsatz, lueckenSatzInEinzelwoertern);
    });
}

function holeMatchesZuAllenLueckenSaetzen(
    vollsaetze,
    lueckensaetzeInEinzelwoertern
) {
    return lueckensaetzeInEinzelwoertern.map((satz) => {
        return findeUebereinstimmendeSaetze(vollsaetze, satz);
    });
}
