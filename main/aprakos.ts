// Во имя Отца и Сына и Святаго Духа. Аминь.
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//вторник,  8 августа 2023 г. 15:29:35 (MSK)

/**
 * Православная Пасхалия есть основание для вычислений. 
 * Реализуется в конструкторе. Предел Пасхалии 2099 год. Далее требуется корректировка вычислений со сдвигом в один день. Если до 2100 года разница в вычислениях состовляет 13 единиц, то после 2100 года разница между числами в календарях достигнет 14 единиц.
 */
interface Paskhalia {
        /**
         * Переменная для объекта с датами.
         */
        readonly paskhalia: {}
}

/**
 * Определение собственного типа для удобства преобразований.
 */
type MyType = {

        [id: string]:
        Date |
        number |
        string |
        undefined
}

/**
* Экспонента (сокращение) числа для суток в миллисекундах (86400000).
*
*/
const CONST_MLS_DAY = 864E5

/**
* Число 70-ти дней в миллисекудах (604800000).
*
*/
const CONST_MLS_MiF = CONST_MLS_DAY * 7 * 10

const CONST_LOG_WARNING = "Будте вниматильней, проверте правильность вводимой даты."
const ER_606 = "НЕ ОПРЕДЕЛЕН КЛЮЧ ГОДА"

/**
* Текущее время очень важно для отработки всего скрипта.
* `TimeBoxOrthodox` - момент времени захваченный и упакованный в Православную шкатулку времени.
* Для правильных вычислений скрипту важно понимать в каком полугодии Богослужебного года «далее **БГ**» находится `timeBox`.
*
*/
class TimeBoxOrthodox implements Paskhalia {


        /**
         * Хранилище дат представленных в разных форматах:
         * миллисекудах, строках.
         */
        formatsEaster: MyType = {

                /**
                 * название дня
                 */
                dayName: undefined,
                /**
                 * число дня
                 */
                dayNum: undefined,

                /**
                 * Введенная дата (или текущая).
                 */
                moment: undefined,
                momentMLS: undefined,

                /**
                 * Год текущей даты.
                 */
                momentYear: undefined,

                /**
                 * Возвращает дату прошедшей Православной Пасхи по Григоринскому календарю.
                 */
                lastEaster: undefined,
                lastEasterMLS: undefined,

                /**
                 * Возвращает дату Православной Пасхи в текущем системном Григорианском календаре.
                 * 
                 * Инициализация данной переменной зависит от момента времени и числа года
                 * по Григорианскому календарю. Так как Богослужебный год начинается и оканчивается
                 * датами Пасх, которые статичны и не должны менять своего значения в коде при
                 * наступлении гражданского нового года «ГНГ». Даты двух Пасх требуют корректировки
                 * ключа для поиска в массиве при наступлении ГНГ, то есть изменения системного года.
                 * Поиск дат Пасх происходит по текущему системному числу года календаря.
                 * Корретировка же ключа происходит по контрольной сумме,
                 * которой инициализируется свойство `keySystemYear`. Подробнее [здесь](../001.html).
                 */
                easterMLS: undefined,

                /**
                 * Пасха для текущей части БГ. Зависит от текущего системного года.
                 */
                easter: undefined,
                nextEasterMLS: undefined,

                /**
                 * Возвращает дату ожидаемой Православной Пасхи по Григорианскому календарю.
                 */
                nextEaster: undefined,

                /**
                 * Дата Недели мытаря и фарисея.
                 */
                mif: undefined,
                mifMLS: undefined,

                /**
                 * Дата Воздвижения Креста
                 */
                vozdviggenie: undefined,
                vozdviggenieMLS: undefined,
                vhodMLS: undefined,
                vhod: undefined,

                /**
                 * Флаг первого понедельника после праздника Воздвижения Креста. Содержит значение строкового типа – `да` или `нет`.
                 * Уточняет наступление данного дня, в который начинается Евангелие от Луки, зачало 10.
                 */
                mondayAfterVozdviggenie: undefined,

                /**
                 * Количество промежуточных седмиц (Богоявленская отступка).
        */
                promWeeks: undefined,

                /**
                 * Количество седмиц в БГ
                 */
                allWeeks: undefined,

                /**
                 * Номер текущей седмицы.
                 */
                currentWeek: undefined,

                /**
                 * Номер текущей седмицы с учетом отступки.
                 */
                currentWeekStupka: undefined,

                /**
                 * Дата начала Великого Поста.
                 */
                beginningLent: undefined,
                beginningLentMLS: undefined,

                /**
                 * Остаток дней до Пасхи.
                 */
                ostatok: undefined,

                /**
                 * Дата праздника Вознесение (сороковой день после Воскресения
                 * Христова).
                 */
                voznesenie: undefined,
                voznesenieMLS: undefined,

                /**
                 * Дата праздника Пятидесятницы.
                 */
                pyatiDesyatnica: undefined,
                pyatiDesyatnicaMLS: undefined,

                /**
                 * Отступка на Воздвижение Креста.
                 */
                vozStupka: undefined,

                /**
                 *  Глас текущей седмицы
                 */
                glas: undefined

        }


        /**
         * Хранилище html-ссылок для DOM элементов
         */
        formatsLinks: MyType = {

                // Ссылка на страницу текущего зачала.
                linkToAprakosPage: 0,

                // Встраивание элементов `DOM`
                linkToElementIDSeed: undefined,
                linkToElementID2: "нет",
                linkToElementID3: "нет",
                linkToElementID4: undefined,
                linkToElementID5: undefined,
                linkToElementID6: undefined,


        }

        /**
         * Метод вычисляет номер гласа для текущей седмицы.
         * 
         * @returns 
         */

        glasSedmici() {

                let gls = this.formatsEaster.currentWeek as number % 8 - 1
                if (gls > 0) {
                        this.formatsEaster.glas = gls;
                } else if (gls < 0) {

                        this.formatsEaster.glas = 7;

                } else {

                        this.formatsEaster.glas = 8;
                }

                return `Для текущей ${this.formatsEaster.currentWeek} седмицы установлен глас – ${this.formatsEaster.glas}`;

        }

        // Коллекция двунадесятых праздников, из которых 9
        // статичны и 4 динамичных, которые требуют вычисления своих дат в зависимости от даты прошедшей Пасхи и соответствено текущей седмицы.
        NINEHOLIDAYS = {

                rojdestvoBogorodici: { month: 9, day: 21 },
                vozdvijjenieKresta: { month: 9, day: 27 },
                vvedenieVoHram: { month: 12, day: 3 },
                rojdestvoXristovo: { month: 1, day: 7 }, // 0 = month of January
                kreshenieGospodne: { month: 1, day: 19 },
                sretenieGospodne: { month: 2, day: 15 },
                blagoveshenieBogorodici: { month: 4, day: 7 },
                // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                //  Здесь бывают по календарю еще четыре `ПЕРЕХОДЯЩИХ` празнества:
                // 8. Вход Господень в Иерусалим,
                // 0. Пасха(не входящая в состав двунадесятых),
                // 9. Вознесение,
                // 10. Пятьдесятница.
                // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                preobrajjenieGospodne: { month: 8, day: 19 },
                uspenieBogorodici: { month: 8, day: 28 }

        }


        /**
         * Названия дней седмицы в правильном порядке на русском языке.
         */
        arayDays = [
                'ВОСРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'
        ];

        /**
        * Православная Пасхалия по датам Григорианского Календаря 1999—2100 год.
        * Имеет индексную сигнатуру (подпись).
        *
        */
        paskhalia: { [key: number]: [number, number] } = {

                1999: [4, 11], 2000: [4, 30], 2001: [4, 15], 2002: [5, 5], 2003: [4, 27], 2004: [4, 11], 2005: [5, 1], 2006: [4, 23], 2007: [4, 8], 2008: [4, 27], 2009: [4, 19], 2010: [4, 4], 2011: [4, 24], 2012: [4, 15], 2013: [5, 5], 2014: [4, 20], 2015: [4, 12], 2016: [5, 1], 2017: [4, 16], 2018: [4, 8], 2019: [4, 28], 2020: [4, 19], 2021: [5, 2], 2022: [4, 24], 2023: [4, 16], 2024: [5, 5], 2025: [4, 20], 2026: [4, 12], 2027: [5, 2], 2028: [4, 16], 2029: [4, 8], 2030: [4, 28], 2031: [4, 13], 2032: [5, 2], 2033: [4, 24], 2034: [4, 9], 2035: [4, 29], 2036: [4, 20], 2037: [4, 5], 2038: [4, 25], 2039: [4, 17], 2040: [5, 6], 2041: [4, 21], 2042: [4, 13], 2043: [5, 3], 2044: [4, 24], 2045: [4, 9], 2046: [4, 29], 2047: [4, 21], 2048: [4, 5], 2049: [4, 25], 2050: [4, 17], 2051: [5, 7], 2052: [5, 21], 2053: [4, 13], 2054: [5, 3], 2055: [5, 18], 2056: [4, 9], 2057: [4, 29], 2058: [4, 14], 2059: [5, 4], 2060: [4, 25], 2061: [4, 10], 2062: [4, 30], 2063: [4, 22], 2064: [4, 13], 2065: [4, 26], 2066: [4, 18], 2067: [4, 10], 2068: [4, 29], 2069: [4, 14], 2070: [5, 4], 2071: [4, 19], 2072: [4, 10], 2073: [4, 30], 2074: [4, 22], 2075: [4, 7], 2076: [4, 26], 2077: [4, 18], 2078: [5, 8], 2079: [4, 23], 2080: [4, 14], 2081: [5, 4], 2082: [4, 19], 2083: [4, 11], 2084: [4, 30], 2085: [4, 15], 2086: [4, 7], 2087: [4, 27], 2088: [4, 18], 2089: [5, 1], 2090: [4, 23], 2091: [4, 8], 2092: [4, 27], 2093: [4, 19], 2094: [4, 11], 2095: [4, 24], 2096: [4, 15], 2097: [5, 5], 2098: [4, 27], 2099: [4, 12], 2100: [5, 2]

        }


        /**
        * Текущий системный момент времени
        */
        theMoment!: Date


        /**
        * Ключ системного года.
        * Новый год делит на две части Пасхальный или Бгслужéбный Го́дъ.
        * Положительное значение ключа указывает на первую часть `БГ`.
        * Отрицательное значение указывает на вторую часть `БГ`.
        *
        */
        keySystemYear: number = 0

        /**
        * Конструктор может принимать дату в формате `YYYY/mm/dd`
        * разделенную слешами ` / `. Метод проверяет введенную дату в
        * диапазоне Пасхалии. Инициализирует `momemt` входящей датой и
        * вызывает функции для вычисления необходимых значений. Метод
        * `insertElements` вызывается внутри блока
        * `try`, потому что в данном методе присутствует код для изменения
        * элементов `DOM`.
        *
        * Рекомендация: - лучше вынести метод `insertElements` из
        * конструктора класса `TimeBoxOrthodox`, вызывая его после
        * определения экземпляра или в коде, или на странице `HTML`
        *
        */

        constructor(userYear?: string) {

                this.theMoment = new Date()
                this.theMoment.setHours(0, 0, 0, 0)

                try {

                        if (userYear != undefined) {
                                // TODO: 434-2021-333 требуется валидация введенных параметров

                                let valDate = this.validate(userYear)

                                this.theMoment = new Date(valDate)
                                this.formatsEaster.moment = this.theMoment
                                console.log(`Установленная дата: ${this.formatsEaster.moment.toString().slice(0, 15)}`);
                        } else {
                                // this.theMoment = new Date()
                                this.formatsEaster.moment = this.theMoment
                                console.log(`Установленная дата: ${this.formatsEaster.moment.toString().slice(0, 15)}`);

                        }
                } catch (e) {

                        console.log(e)

                }
                this.calculateDatesEaster()
                this.calculateAllWeks()
                this.vozdviggenieKresta()
                this.vhodGospoden()
                this.calculateLinksAll()
                this.voznesnieGospodne()
                this.pyatDesyatnica()
                // this.replaceDataTooltip()
                this.linkToID()
                this.devTools()

                try {
                        this.insertElements()
                }
                catch (e) {

                        console.log('Блока нет !!!')

                } finally {

                        console.log('Продолжаем … полет по коду !!!')

                }

        }


        /**
         * Проверяет диапазон для введенного значения и корректирует дату до `YYYY`.
         * 
         * 
         */
        validate(userdate: string): string {

                let valYear: number = 0
                valYear = Number(userdate.slice(0, 4))

                if (userdate.length > 3 && valYear >= 2016 && valYear <= 2100) {
                        // возврат к значениям по умолчанию
                        document.querySelectorAll('.colorBlock').forEach(n => n.classList.remove('colorBlock'))
                        document.querySelectorAll('.seeddayON').forEach(n => n.classList.replace('seeddayON', 'seedday'))
                        document.getElementById('zachala')!.innerHTML = `Зачала всего лета по Пасхе в год <span class="yearBG">${valYear} </span>`
                        document.location.replace('#')

                        return `${userdate}/${this.theMoment.getMonth() + 1}/${this.theMoment.getDate()}`



                } else {

                        throw `${valYear} ; Введенное вами: / ${userdate} / не подходит.
                  Попробуйте ввести только номер года – "2040"`

                }

        }

        /**
        * Высчитывает даты Пасх в зависимости от введенной даты и сохраняет их значения в милисекундах.
        */
        calculateDatesEaster(): string {

                // Моммент в миллисекудах
                this.formatsEaster.momentMLS = this.theMoment.getTime()

                // Номер дня текущей даты.
                this.formatsEaster.dayNum = this.theMoment.getDay() + 1

                // Берем год от даты
                this.formatsEaster.momentYear = (this.formatsEaster.moment as Date).getFullYear()

                // Формируем строку-дату Пасхи для введенного ГНГ
                this.formatsEaster.easter = `${this.formatsEaster.momentYear}/${this.paskhalia[this.formatsEaster.momentYear][0]}/${this.paskhalia[this.formatsEaster.momentYear][1]}`

                // Форматируем в млсек.
                let ddf = new Date(this.formatsEaster.easter as string)
                this.formatsEaster.easterMLS = ddf.getTime()


                // Конструктор для даты Пасхи
                let easter = new Date(this.formatsEaster.easterMLS)

                // количество дней до Пасхи (-); от Пасхи (+) в зависимости от знака результата вычисления
                this.keySystemYear = (this.formatsEaster.momentMLS - this.formatsEaster.easterMLS) / CONST_MLS_DAY


                if (this.keySystemYear > 0) {
                        var next = this.formatsEaster.momentYear + 1 + "/" + this.paskhalia[this.formatsEaster.momentYear + 1][0] + "/" + this.paskhalia[this.formatsEaster.momentYear + 1][1];
                        this.formatsEaster.nextEasterMLS = new Date(next).getTime();
                        this.formatsEaster.nextEaster = next;
                        this.formatsEaster.lastEasterMLS = easter.getTime();
                        this.formatsEaster.lastEaster = this.formatsEaster.easter;
                }
                else {
                        var last = this.formatsEaster.momentYear - 1 + "/" + this.paskhalia[this.formatsEaster.momentYear - 1][0] + "/" + this.paskhalia[this.formatsEaster.momentYear - 1][1]

                        this.formatsEaster.nextEasterMLS = easter.getTime();
                        this.formatsEaster.nextEaster = easter.toString().slice(0, 15);
                        this.formatsEaster.lastEasterMLS = new Date(last).getTime();
                        this.formatsEaster.lastEaster = last;
                }


                this.mif()

                return "Мир всем!"

        }


        /**
         * Высчитывает Неделю мытаря и фарисея,
         * которая начинается за десять седмиц до Православной Пасхи.
         * Возвращает дату в формате слэш.
        */
        mif(): string {

                this.formatsEaster.mifMLS = (this.formatsEaster.nextEasterMLS as number) - CONST_MLS_MiF
                this.formatsEaster.mif = new Date(this.formatsEaster.mifMLS).toString().slice(0, 15)
                return `День мытаря и фарисея приходится на ${this.formatsEaster.mif}`
        }

        /**
         * Высчитывает дату Вознесения Господня для текущего БГ.
         */
        voznesnieGospodne(): string {


                this.formatsEaster.voznesenieMLS = (this.formatsEaster.lastEasterMLS as number) + (CONST_MLS_DAY * 39)
                this.formatsEaster.voznesenie = new Date(this.formatsEaster.voznesenieMLS).toString().slice(0, 15)
                return `Вознесение приходится на ${this.formatsEaster.voznesenie}`
        }

        /**
         * Дата Пятидесятницы.
         * Возвращает дату Пятидесятницы для текущего БГ.
         */
        pyatDesyatnica(): string {


                this.formatsEaster.pyatiDesyatnicaMLS = (this.formatsEaster.lastEasterMLS as number) + (CONST_MLS_DAY * 49)
                this.formatsEaster.pyatiDesyatnica = new Date(this.formatsEaster.pyatiDesyatnicaMLS).toString().slice(0, 15)
                return `Пятьдесятница приходится на ${this.formatsEaster.pyatiDesyatnica}`
        }



        /**
         * Высчитывает  все что связано с седмицами.
         * Заполняет массив `formatsEaster` вычисленными данными.
         * Возвращает данные по седмицам (результаты вычислений).
         */
        calculateAllWeks(): string {

                this.formatsEaster.dayName = this.arayDays[this.theMoment.getDay()]

                // Количество седмиц в году.
                this.formatsEaster.allWeeks = parseInt(
                        (this.formatsEaster.nextEasterMLS as number - (this.formatsEaster.lastEasterMLS as number))
                        / CONST_MLS_DAY / 7 + "", 10)
                // Количество промежуточных седмиц пред МиФ. Отступка Богояввденская.
                this.formatsEaster.promWeeks = this.formatsEaster.allWeeks - 50

                // TODO: // 436-2021-777 Выдает седмицу на единицу менее реальной из-за функции `parseInt()`
                // Текущая седмица от Пасхи.
                let sss = this.formatsEaster.currentWeek = parseInt(
                        (this.formatsEaster.momentMLS as number - (this.formatsEaster.lastEasterMLS as number))
                        / CONST_MLS_DAY / 7 + "", 10) + 1

                // Седмица начала Великого поста (Святой
                // четыредесятницы)
                this.formatsEaster.beginningLentMLS = parseInt((this.formatsEaster.nextEasterMLS as number - CONST_MLS_DAY * 48) + "", 10)
                this.formatsEaster.beginningLent = new Date(this.formatsEaster.beginningLentMLS).toString().slice(0, 15)

                this.formatsEaster.currentWeekStupka = sss - this.formatsEaster.promWeeks

                // Высчитываем остаток дней до Пасхи.
                let zero = parseInt((this.formatsEaster.nextEasterMLS as number - (this.formatsEaster.momentMLS as number)) / CONST_MLS_DAY + "", 10)

                let today = "Сегодня"

                // День Пасхи не входит в исчисление седмиц для БГ. На день Пасхи приходится следущая седмица по счету, то есть на единицу более последней седмицы. Проверка `zero` указывает на нулевую разницу меджду случившейся Пасхой и данным моментом времени.
                if (zero == 0) {

                        this.formatsEaster.ostatok = "СЕГОДНЯ ПАСХА ХРИСТОВА"
                        today = "Сегодня"
                        console.log(`Сегодня Светлое Христово Воскресение. Христос Воскресе!`)

                } else {

                        this.formatsEaster.ostatok = zero
                        today = "Остаток дней до Пасхи"

                }


                return `${today} – ${this.formatsEaster.ostatok} \n Богослужебных седмиц - ${this.formatsEaster.allWeeks}\n Промежуточных седмиц - ${this.formatsEaster.promWeeks} \n Текущая седмица - ${this.formatsEaster.currentWeek}\n Седмица по Пятьдесятнице - ${this.formatsEaster.currentWeek - 7}`
        }

        /**
         * Высчитывает количество седмиц до праздника Воздвижения.
         * Возвращает количество дней - ступок.
         * Определяет первый понедельник по Воздвижении.           
         * Определяет условия для преступок и отступок.
         */

        vozdviggenieKresta(): string {

                let stupka = 0
                let voz = ""
                let sliceLastEaster = this.formatsEaster.lastEaster as string
                let sliceLastEaster2 = sliceLastEaster.slice(0, 4)

                this.formatsEaster.vozdviggenie = new Date(sliceLastEaster2 + "/9/27")
                this.formatsEaster.vozdviggenieMLS = this.formatsEaster.
                        vozdviggenie.getTime()


                // Определение даты первого Понедельника следующей седмицы по Воздвижении Креста Господня – 27 сентября текущего года.
                let a = new Date(this.formatsEaster.vozdviggenieMLS)
                let aaa = 1 + 7 - (a.getDay() % 7)
                let updateTheDate = a.getDate() + aaa
                a.setDate(updateTheDate);
                this.formatsEaster.mondayAfterVozdviggenie = a

                // Деинит переменной, если еще не наступил Понедельник по Воздвижении.
                if (

                        this.theMoment.getTime() < this.formatsEaster.mondayAfterVozdviggenie.getTime()

                ) {
                        this.formatsEaster.mondayAfterVozdviggenie = undefined
                }

                // В данной строке расчитывается количество седмиц от Недели Пятидесятницы до Недели Воздвижения Креста.
                // `- 6` в конце строки кода указывает на счет от Пятидесятницы.
                let kolichestvoSedmicPoPyatidesyatnice = (this.formatsEaster.vozdviggenieMLS - (this.formatsEaster.lastEasterMLS as number)) / CONST_MLS_DAY / 7 - 6
                console.log(`Седмица на Воздвижение - ${Math.floor(kolichestvoSedmicPoPyatidesyatnice)}`)

                // Если `stupka` равна нулю, то отступки или преступки нет.
                stupka = Math.floor(kolichestvoSedmicPoPyatidesyatnice) - 17

                if (
                        // Условие наступления отступки
                        stupka > 0
                        && this.formatsEaster.mondayAfterVozdviggenie!
                ) {
                        // это отступка (- единица, это коррекция для седмицы в
                        // отличии от Недели)

                        console.log(`Отступка составляет - ${stupka} седмицы.`)

                        this.formatsEaster.vozStupka = stupka - 1
                        voz = `Воздвижение приходится на ${kolichestvoSedmicPoPyatidesyatnice} седмицу.
                        Отступка составляет - ${stupka} седмицы.`

                }

                else if (
                        //Условие преступки
                        stupka < 0 && this.formatsEaster.mondayAfterVozdviggenie
                ) {


                        this.formatsEaster.vozStupka = stupka
                        voz = `Воздвижение приходится на ${kolichestvoSedmicPoPyatidesyatnice} седмицу.
                        Преступка составляет -  ${stupka} седмицы.`

                }
                else {

                        voz = `Воздвижение приходится на седмицу - ${kolichestvoSedmicPoPyatidesyatnice}. Отступок нет.`
                }

                return voz
        }

        vhodGospoden(): string {

                // if(this.keySystemYear != 0){
                this.formatsEaster.vhodMLS = (this.formatsEaster.nextEasterMLS as number) - CONST_MLS_DAY * 7
                this.formatsEaster.vhod = new Date(this.formatsEaster.vhodMLS).toString().slice(0, 15)

                return `Вход Господень во Иерусалим: ${this.formatsEaster.vhod}`
                // } else {

                // console.log(CONST_LOG_WARNING)
                //   return ER_606

                // }
        }

        calculateLinksAll(): void {

                let ccc = 0

                // TODO: 11-2021
                this.formatsLinks.linkToAprakosPage = this.formatsEaster.currentWeek + '/' + this.formatsEaster.dayNum + '.html'

                // TODO: // корректировка отступки  для ссылок в древе на id седмицы /// 444-2021-555
                if (this.formatsEaster.currentWeek as number > 40 && this.formatsEaster.promWeeks as number > 0) {

                        ccc = this.formatsEaster.currentWeekStupka as number
                        // TODO: // Требуется откорректировать ссылку с учётом отступки.
                        this.formatsLinks.linkToAprakosPage = ccc + '/' + this.formatsEaster.dayNum + '.html'
                        this.formatsLinks.linkToElementID2 = `<a href="#seedday-${ccc - 1}-7"  title="Сегодня : ${this.formatsEaster.dayName}">${this.formatsEaster.promWeeks as number + ccc}</a>`
                        this.formatsLinks.linkToElementID4 = `<a href="#seedday-${ccc - 1}-7"  title="Сегодня : ${this.formatsEaster.dayName}">${this.formatsEaster.promWeeks as number + ccc - 7}</a>`


                } else if (

                        this.formatsEaster.currentWeek as number > 21 && this.formatsEaster.currentWeek as number < 27 && this.formatsEaster.mondayAfterVozdviggenie) {
                        // S:S Установить корректную ссылку на зачало в стволе!!! 555
                        ccc = this.formatsEaster.currentWeek as number - (this.formatsEaster.vozStupka as number)
                        this.formatsLinks.linkToAprakosPage = ccc + '/' + this.formatsEaster.dayNum + '.html'
                        this.formatsLinks.linkToElementID2 = `<a href="#seedday-${ccc - 1}-7"  title="Сегодня : ${this.formatsEaster.dayName}">${this.formatsEaster.currentWeek as number}</a>`
                        this.formatsLinks.linkToElementID4 = `<a href="#seedday-${ccc - 1}-7"  title="Сегодня : ${this.formatsEaster.dayName}">${this.formatsEaster.currentWeek as number - 7}</a>`

                } else {

                        let ccc = this.formatsEaster.currentWeek as number
                        this.formatsLinks.linkToElementID2 = `<a href="#seedday-${ccc - 1}-7"  title="Сегодня : ${this.formatsEaster.dayName}">${ccc}</a>`
                        this.formatsLinks.linkToElementID4 = `<a href="#seedday-${ccc - 1}-7"  title="Сегодня : ${this.formatsEaster.dayName}">${ccc - 7}</a>`

                }
        }

        /**
         * Метод встраивает и изменяет элементы DOM
         *
         * В методе корректируются данные, которые задают ссылку на id-элемент страницы.
         * Также, в данном месте, нужно вывести date3 в DOM название для блока.
         * Это название выводиться всегда и в ином виде только для первой седмицы.
         * На главной странице вид счета седмиц должен оставаться неизменным и последовательным.
         * Ссылка же на id-элемент страницы  изменяется с учётом отступок и преступок.
         *
         * TODO:  Требуется добавить код для вычисления Воздвиженской отступки. /// 445-2021-555
         */

        insertElements(): string {

                this.glasSedmici();

                // Вставляем глас седмицы по Октоиху

                document.getElementById('date5')!.innerHTML = `Глас седмицы - ${this.formatsEaster.glas}`

                let description = "Метод класса. Вставляет элементы DOM."

                if (this.formatsEaster.currentWeekStupka as number < 51) {


                        document.getElementById('date2')!.innerHTML = this.formatsLinks.linkToElementID2 as string
                        document.getElementById('date4')!.innerHTML = this.formatsLinks.linkToElementID4 as string

                } else {

                        document.getElementById('date')!.innerHTML = "ХРИСТОС ВОСКРЕСЕ!"
                        document.getElementById('date')!.className += " XB"

                }

                if (this.formatsEaster.currentWeek as number > 7) {

                        document.getElementById('date3')!.innerHTML = "По Пятидесятнице"

                } else if (this.formatsEaster.currentWeek == 1) {

                        document.getElementById('date3')!.innerHTML = "СВЕТЛАЯ СЕДМИЦА"
                        document.getElementById('date4')!.remove()

                } else {

                        // здесь можно разместить код для 49 дней по Пасхе 
                        document.getElementById('date3')!.remove()
                        document.getElementById('date4')!.remove()
                        document.getElementById('date5')!.remove()

                }

                // Выделение блока текущей седмицы.

                var slb, vvv = "seed"
                let seedday = "none"

                if (this.formatsEaster.currentWeek as number > 40 && this.formatsEaster.ostatok as number > 70) {
                        //  если есть отступка, меняем цвет и
                        //  добавляем классы `.colorBlock .promWeeks`
                        vvv = vvv + this.formatsEaster.currentWeekStupka;
                        slb = " colorBlock promWeek";
                        document.getElementById(vvv)!.style.backgroundColor = '#d5d5d5';
                        seedday = "seedday-" + this.formatsEaster.currentWeekStupka + "-" + this.formatsEaster.dayNum;
                }
                // =-=-=-=-=-=-=-=-=
                if (this.formatsEaster.currentWeek as number > 40 && this.formatsEaster.ostatok as number < 70) {
                        //  отступка закончилась, меняем цвет на обратный и
                        // оставляем счет седмиц с учетом отступки
                        vvv = vvv + this.formatsEaster.currentWeekStupka;
                        slb = " colorBlock";
                        // document.getElementById(vvv).style.backgroundColor = '#d5d5d5';
                        seedday = "seedday-" + this.formatsEaster.currentWeekStupka + "-" + this.formatsEaster.dayNum;
                }

                // Оформление блока на время отступки до Воздвижения Креста.
                if (this.formatsEaster.currentWeek as number >= 22 && this.formatsEaster.currentWeek as number <= 27 && this.formatsEaster.vozStupka as number > 0) {
                        vvv = vvv + (this.formatsEaster.currentWeek as number - (this.formatsEaster.vozStupka as number));
                        slb = " colorBlock";
                        seedday = "seedday-" + (this.formatsEaster.currentWeek as number - (this.formatsEaster.vozStupka as number)) + "-" + this.formatsEaster.dayNum;

                }
                // Условия ПРЕСТУПКИ, которые случаются при поздней Пасхе
                else if (this.formatsEaster.currentWeek as number >= 22 && this.formatsEaster.currentWeek as number <= 27 && this.formatsEaster.vozStupka as number < 0 && this.formatsEaster.mondayAfterVozdviggenie) {
                        vvv = vvv + (this.formatsEaster.currentWeek as number - (this.formatsEaster.vozStupka as number));
                        slb = " colorBlock";
                        seedday = "seedday-" + (this.formatsEaster.currentWeek as number - (this.formatsEaster.vozStupka as number)) + "-" + this.formatsEaster.dayNum;

                } else
                        if (this.formatsEaster.currentWeek as number <= 40) {
                                vvv = vvv + this.formatsEaster.currentWeek;
                                slb = " colorBlock";
                                seedday = "seedday-" + this.formatsEaster.currentWeek + "-" + this.formatsEaster.dayNum;
                        }
                // TODO: // Требуется продолжить скрипт на условиях дальнейшего распротранения. 436-2021-555
                // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
                // День Пасхи приходится на начало следующей седмицы по системному календарю, которая числом превышает
                // допущенный диаппазон с учетом отступок в 50 седмиц. Поэтому при наступлении исключения
                // делается редирект на Пасхальный канон.  Достсуп же ко всем другим зачалам закрывается.
                document.getElementById(seedday)!.className += 'ON';
                document.getElementById(vvv)!.className += slb;
                // alert("Xристос Bоскрксе!\nСегодня светлое Христово Воскресение!")
                //
                // document.location.replace('1/1.html')

                // console.log('-=-=-=-=-=-',vvv, colorBlockID)

                return description


        }

        /**
        * Метод обрабатывает URL проверяя якорь `hash`. Если хеш найден добавляются стили.

        * Метод проверяет предыдущий URL. Если предыдущий URL был со страницы `about`, к элементу добавляются стили и обратная ссылка на страницу `about`.
        *
        *
        */
        linkToID() {

                let anchor = document.location.hash.slice(1)
                const segmentsURL = document.location.pathname.split('/')
                const previosURL = localStorage.getItem("ystm")
                localStorage.setItem("ystm", document.location.pathname)

                if (anchor != "" && segmentsURL.lastIndexOf("stvol.html") == -1) {
                        try {
                                document.getElementById(anchor)!.setAttribute('style', 'cursor: pointer; color: #a55858; background-color: #f4b5ff22; padding: 0px 0.4em 0px; border-radius: 7px;')
                                if (previosURL?.search("about.html") != -1) { document.getElementById(anchor)!.setAttribute('onclick', 'document.location.replace("../about.html"); return false') }

                        } catch (error) {
                                console.log(error)
                                anchor = " …не найден."

                        }

                        return 'Элемент id в составе URL: #' + anchor;
                }

                return null;
        }



        normColor = ""
        titleColor = "#888888"

        /**
        * Метод менят местами контент между тегами. 
        * Всплывающая посказка заменяет подсказываемое.
        *
         */
        replaceDataTooltip() {

                [this.normColor, this.titleColor] = [this.titleColor, this.normColor];

                const elems: HTMLAllCollection | any = document.querySelectorAll(".tooltip");

                elems.forEach((element: { addEventListener: (arg0: string, arg1: () => void) => void; getInnerHTML: () => any; getAttribute: (arg0: string) => any; innerHTML: any; setAttribute: (arg0: string, arg1: any) => void; style: { color: string } }) => {

                        element.addEventListener('click', () => {
                                console.log("=-=-=-=-=-=-");
                                let norm = element.getInnerHTML()
                                let dataToolTip = element.getAttribute('data-tooltip')
                                element.innerHTML = dataToolTip
                                console.log(norm + " – " + dataToolTip)
                                element.setAttribute('data-tooltip', norm)
                                element.style.color = this.normColor;

                        })

                        // setTimeout(() => {
                        //     elem.innerHTML = norm;
                        //     elem.setAttribute('data-title', dataTitle);
                        //     elem.style.color = "";
                        // }, 7000);
                }
                )
        }
        devTools() {

                const protocolHTTP: any = document.location.protocol

                const styleCSS = document.styleSheets.length != 0
                if (protocolHTTP == "http:" && styleCSS) {
                        try {
                                const a = document.styleSheets[0]
                                const b: any = [...a.cssRules]
                                let c = b.find((obj: any) => obj.selectorText === '.tooltip')
                                c.style.setProperty('color', 'orangered')
                                c.style.setProperty('background-color', '#faa3')
                                c = b.find((obj: any) => obj.selectorText === '.tooltip')
                                c.style.setProperty('color', 'orangered')
                                c.style.setProperty('background-color', '#faa3')
                        // c.style.setProperty('text-decoration', 'tan underline wavy 2px')

                        } catch (error) { console.log(error) }
                }
        }





} // end class

/**
 * Экземпляр по умолчанию с именем `apr`. Для получения дат другого Богослужебного года установите в скрипт свой экземпляр передав в параметре конструктора нужный вам год, например так:
 * 
 * ```typescript
 * let apr = new TimeBoxOrthodox("2037")
 * ```
 * 
 */
// 
let apr = new TimeBoxOrthodox()

// const ystm = () => { return console.log("=-=-=-=123-=-=-=-") }
// apr.calculateAllWeks()
