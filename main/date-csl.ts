/**
 * 
 *  Конвертирование григорианского года
 *  от 1000-го и далее в Церковный славянский (цсл).
 *  
 *  Требуется подключенный цсл. шрифт.
 * 
 */

let currentYearGRG: number = new Date().getFullYear()

const massYearsCSL = {

    tschi: "¤",
    cifri: ['', 'а', "в", 'г', 'д', 'є', 's', 'з', 'и', 'f'],
    desyatki: ['', 'i', 'к', 'л', 'м', 'н', '…', 'o', 'п', 'ч'],

    // FIXME: В шрифте отсутствует глиф числа 400 – у.
    sotni: ['', 'р', 'с', 'т', 'u', 'f', 'х', 'p', 't', 'ц']

}

function currentYearCSl() {

    let yearInsert = massYearsCSL.tschi

    let tsch = massYearsCSL.tschi

    let yearString = String(currentYearGRG)

    if (yearString.length == 3) {

        yearString = "0" + yearString
        tsch = ""

    }


    // Считываем цифру тысяч
    let tscha = Number(yearString.slice(0, 1))

    // Считываем цифру сотен
    let sotnya = Number(yearString.slice(1, 2))

    // Считываем цифру десятков
    let desyatok = Number(yearString.slice(2, 3))

    // Считываем цифру единиц
    let edinica = Number(yearString.slice(-1))

    if (sotnya != 0) {

        // реализация сотен
        yearInsert += massYearsCSL.cifri[tscha] + massYearsCSL.sotni[sotnya]
            + massYearsCSL.desyatki[desyatok] + "7" + massYearsCSL.cifri[edinica]


    }
    else {

        // реализация десятков
        yearInsert += massYearsCSL.cifri[tscha] + massYearsCSL.desyatki[desyatok]
            + "7" + massYearsCSL.cifri[edinica]

    }


    // для годов второго десятка (10…19)
    if (Number(yearString.slice(2, 4)) < 20) {

        yearInsert = tsch + massYearsCSL.cifri[tscha]
            + massYearsCSL.sotni[sotnya]
            + massYearsCSL.cifri[edinica] + "7" + massYearsCSL.desyatki[desyatok]

    }

    return yearInsert;
}


document.getElementById('ystm-date')!.innerHTML = currentYearCSl()
document.getElementById('ystm-date')!.setAttribute('title', `${currentYearGRG} год`)



