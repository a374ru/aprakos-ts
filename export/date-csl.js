"use strict";
var massYearsCSL = {
    tschi: "¤",
    cifri: ['', 'а', "в", 'г', 'д', 'є', 's', 'з', 'и', 'f'],
    desyatki: ['', 'i', 'к', 'л', 'м', 'н', '…', 'o', 'п', 'ч'],
    sotni: ['', 'р', 'с', 'т', 'у', 'f', 'х', 'p', 't', 'ц']
};
function currentYearCSl() {
    let yearInsert = massYearsCSL.tschi;
    let currentYearGRG = new Date('231.2.2').getFullYear();
    console.log(currentYearGRG)

    let yearString = String(currentYearGRG);
    if (yearString.length == 3) {
        yearString = "0" + yearString;
    }
    // switch (yearString.length) {


    //     case 3:
    //         yearString = "0" + yearString;
    //         console.log(yearString, '----3---')
    //         break;
    //     case 2:
    //         yearString = "00" + yearString;
    //         console.log(yearString, '----2---')
    //         break;
    //     case 1:
    //         yearString = "000" + yearString;
    //         console.log(yearString, '----1----')
    //         break;
    //     default:
    //         yearString;
    //         console.log(yearString, '----Df----')
    //         break;
    // }
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
        yearInsert = massYearsCSL.tschi + massYearsCSL.cifri[tscha]
            + massYearsCSL.sotni[sotnya]
            + massYearsCSL.cifri[edinica] + "7" + massYearsCSL.desyatki[desyatok];
    }
    return yearInsert;
}

// currentYearCSl()
let rrr = document.getElementById('ystm-date').innerHTML = currentYearCSl();
