"use strict";
let currentYearGRG = new Date().getFullYear();
const massYearsCSL = {
    tschi: "¤",
    cifri: ['', 'а', "в", 'г', 'д', 'є', 's', 'з', 'и', 'f'],
    desyatki: ['', 'i', 'к', 'л', 'м', 'н', '…', 'o', 'п', 'ч'],
    sotni: ['', 'р', 'с', 'т', 'u', 'f', 'х', 'p', 't', 'ц']
};
function currentYearCSl() {
    let yearInsert = massYearsCSL.tschi;
    let tsch = massYearsCSL.tschi;
    let yearString = String(currentYearGRG);
    if (yearString.length == 3) {
        yearString = "0" + yearString;
        tsch = "";
    }
    let tscha = Number(yearString.slice(0, 1));
    let sotnya = Number(yearString.slice(1, 2));
    let desyatok = Number(yearString.slice(2, 3));
    let edinica = Number(yearString.slice(-1));
    if (sotnya != 0) {
        yearInsert += massYearsCSL.cifri[tscha] + massYearsCSL.sotni[sotnya]
            + massYearsCSL.desyatki[desyatok] + "7" + massYearsCSL.cifri[edinica];
    }
    else {
        yearInsert += massYearsCSL.cifri[tscha] + massYearsCSL.desyatki[desyatok]
            + "7" + massYearsCSL.cifri[edinica];
    }
    if (Number(yearString.slice(2, 4)) < 20) {
        yearInsert = tsch + massYearsCSL.cifri[tscha]
            + massYearsCSL.sotni[sotnya]
            + massYearsCSL.cifri[edinica] + "7" + massYearsCSL.desyatki[desyatok];
    }
    return yearInsert;
}
document.getElementById('ystm-date').innerHTML = currentYearCSl();
document.getElementById('ystm-date').setAttribute('title', `${currentYearGRG} год`);
