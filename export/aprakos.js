// Во имя Отца и Сына и Святаго Духа. Аминь.
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
/**
* Экспонента (сокращение) числа для суток в миллисекундах (86400000).
*
*/
var CONST_MLS_DAY = 864E5;
/**
* Число 70-ти дней в миллисекудах (604800000).
*
*/
var CONST_MLS_MiF = CONST_MLS_DAY * 7 * 10;
var CONST_LOG_WARNING = "Будте вниматильней, проверте правильность вводимой даты.";
var ER_606 = "НЕ ОПРЕДЕЛЕН КЛЮЧ ГОДА";
/**
* Текущее время очень важно для отработки всего скрипта.
* `TimeBoxOrthodox` - момент времени захваченный и упакованный в Православную шкатулку времени.
* Для правильных вычислений скрипту важно понимать в каком полугодии Богослужебного года «далее **БГ**» находится `timeBox`.
*
*/
var TimeBoxOrthodox = /** @class */ (function () {
    /**
    * Конструктор может принимать дату в формате `YYYY/mm/dd`
    * разделенную слешами ` / `. Метод проверяет введенную дату в
    * диапазоне Пасхалии. Инициализирует `momemt` входящей датой и
    * вызывает функции для вычисления необходимых значений. Метод
    * `insertElements` вызывается внутри блока
    * `try`, потому что в данном методе присутствует код для изменения
    * элементов `DOM`.
    *
    * Рекомендация: - лучше вынести меод `insertElements` из
    * конструктора класса `TimeBoxOrthodox`, вызывая его после
    * определения экземпляра или в коде, или на странице `HTML`
    *
    */
    function TimeBoxOrthodox(date) {
        /**
         * Хранилище дат представленных в разных форматах:
         * миллисекудах, строках.
         */
        this.formatsEaster = {
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
             * Уточняет наступление данного дня.
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
        };
        /**
         * Хранилище html-ссылок для DOM элементов
         */
        this.formatsLinks = {
            // Ссылка на страницу текущего зачала.
            linkToAprakosPage: 0,
            // Встраивание элементов `DOM`
            linkToElementIDSeed: undefined,
            linkToElementID2: "нет",
            linkToElementID3: "нет",
            linkToElementID4: undefined,
            linkToElementID5: undefined,
            linkToElementID6: undefined
        };
        // Коллекция двунадесятых праздников, из которых 9
        // статичны и 4 динамичных, которые требуют вычисления своих дат в зависимости от даты прошедшей Пасхи и соответствено текущей седмицы.
        this.NINEHOLIDAYS = {
            rojdestvoBogorodici: { month: 9, day: 21 },
            vozdvijjenieKresta: { month: 9, day: 27 },
            vvedenieVoHram: { month: 12, day: 3 },
            rojdestvoXristovo: { month: 1, day: 7 },
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
        };
        /**
         * Названия дней седмицы в правильном порядке на русском языке.
         */
        this.arayDays = [
            'ВОСРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА'
        ];
        /**
        * Правосавная Пасхалия по датам Григорианского Календаря 1999—2100 год.
        * Имеет индексную сигнатуру (подпись).
        *
        */
        this.paskhalia = {
            1999: [4, 11], 2000: [4, 30], 2001: [4, 15], 2002: [5, 5], 2003: [4, 27], 2004: [4, 11], 2005: [5, 1], 2006: [4, 23], 2007: [4, 8], 2008: [4, 27], 2009: [4, 19], 2010: [4, 4], 2011: [4, 24], 2012: [4, 15], 2013: [5, 5], 2014: [4, 20], 2015: [4, 12], 2016: [5, 1], 2017: [4, 16], 2018: [4, 8], 2019: [4, 28], 2020: [4, 19], 2021: [5, 2], 2022: [4, 24], 2023: [4, 16], 2024: [5, 5], 2025: [4, 20], 2026: [4, 12], 2027: [5, 2], 2028: [4, 16], 2029: [4, 8], 2030: [4, 28], 2031: [4, 13], 2032: [5, 2], 2033: [4, 24], 2034: [4, 9], 2035: [4, 29], 2036: [4, 20], 2037: [4, 5], 2038: [4, 25], 2039: [4, 17], 2040: [5, 6], 2041: [4, 21], 2042: [4, 13], 2043: [5, 3], 2044: [4, 24], 2045: [4, 9], 2046: [4, 29], 2047: [4, 21], 2048: [4, 5], 2049: [4, 25], 2050: [4, 17], 2051: [5, 7], 2052: [5, 21], 2053: [4, 13], 2054: [5, 3], 2055: [5, 18], 2056: [4, 9], 2057: [4, 29], 2058: [4, 14], 2059: [5, 4], 2060: [4, 25], 2061: [4, 10], 2062: [4, 30], 2063: [4, 22], 2064: [4, 13], 2065: [4, 26], 2066: [4, 18], 2067: [4, 10], 2068: [4, 29], 2069: [4, 14], 2070: [5, 4], 2071: [4, 19], 2072: [4, 10], 2073: [4, 30], 2074: [4, 22], 2075: [4, 7], 2076: [4, 26], 2077: [4, 18], 2078: [5, 8], 2079: [4, 23], 2080: [4, 14], 2081: [5, 4], 2082: [4, 19], 2083: [4, 11], 2084: [4, 30], 2085: [4, 15], 2086: [4, 7], 2087: [4, 27], 2088: [4, 18], 2089: [5, 1], 2090: [4, 23], 2091: [4, 8], 2092: [4, 27], 2093: [4, 19], 2094: [4, 11], 2095: [4, 24], 2096: [4, 15], 2097: [5, 5], 2098: [4, 27], 2099: [4, 12], 2100: [5, 2]
        };
        /**
        * Ключ системного года.
        * Новый год делит на две части Пасхальный или Бгслужéбный Го́дъ.
        * Положительное значение ключа указывает на первую часть `БГ`.
        * Отрицательное значение указывает на вторую часть `БГ`.
        *
        */
        this.keySystemYear = 0;
        this.theMoment = new Date();
        try {
            if (date != undefined) {
                // TODO: 434-2021-333 требуется валидация введенных параметров
                var valDate = this.validate(date);
                this.theMoment = new Date(valDate);
                this.formatsEaster.moment = this.theMoment;
                console.log("\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u0434\u0430\u0442\u0430: " + this.formatsEaster.moment.toString().slice(0, 15));
            }
            else {
                // this.theMoment = new Date()
                this.formatsEaster.moment = this.theMoment;
                console.log("\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u0434\u0430\u0442\u0430: " + this.formatsEaster.moment.toString().slice(0, 15));
            }
        }
        catch (e) {
            console.log(e);
        }
        this.calculateDatesEaster();
        this.calculateAllWeks();
        this.vozdviggenieKresta();
        this.vhodGospoden();
        this.calculateLinksAll();
        this.voznesnieGospodne();
        this.pyatDesyatnica();
        try {
            this.insertElements();
        }
        catch (e) {
            console.log('Блока нет !!!');
        }
        finally {
            console.log('Продолжаем … полет по коду !!!');
        }
    }
    /**
     * Метод вычисляет номер гласа для текущей седмицы.
     *
     * @returns
     */
    TimeBoxOrthodox.prototype.glasSedmici = function () {
        var gls = this.formatsEaster.currentWeek % 8 - 1;
        if (gls > 0) {
            this.formatsEaster.glas = gls;
        }
        else if (gls < 0) {
            this.formatsEaster.glass = 7;
        }
        else {
            this.formatsEaster.glass = 8;
        }
        return "\u0414\u043B\u044F \u0442\u0435\u043A\u0443\u0449\u0435\u0439 " + this.formatsEaster.currentWeek + " \u0441\u0435\u0434\u043C\u0438\u0446\u044B \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D \u0433\u043B\u0430\u0441 \u2013 " + this.formatsEaster.glas;
    };
    /**
     * Проверяет диапазон для введенного значения
     */
    TimeBoxOrthodox.prototype.validate = function (userdate) {
        var valYear = 0;
        valYear = Number(userdate.slice(0, 4));
        if (userdate.length > 3 && valYear >= 2016 && valYear <= 2100) {
            // возврат к значениям по умолчанию
            document.querySelectorAll('.colorBlock').forEach(function (n) { return n.classList.remove('colorBlock'); });
            document.querySelectorAll('.seeddayON').forEach(function (n) { return n.classList.replace('seeddayON', 'seedday'); });
            document.getElementById('zachala').innerHTML = "\u0417\u0430\u0447\u0430\u043B\u0430 \u0432\u0441\u0435\u0433\u043E \u043B\u0435\u0442\u0430 \u043F\u043E \u041F\u0430\u0441\u0445\u0435 \u0432 \u0433\u043E\u0434 <span class=\"yearBG\">" + valYear + " </span>";
            document.location.replace('#');
            // TODO: insert code 333
            return userdate + "/" + (this.theMoment.getMonth() + 1) + "/" + this.theMoment.getDate();
        }
        else {
            throw valYear + " ; \u0412\u0432\u0435\u0434\u0435\u043D\u043D\u043E\u0435 \u0432\u0430\u043C\u0438: / " + userdate + " / \u043D\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442.\n                  \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0432\u0432\u0435\u0441\u0442\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u043E\u043C\u0435\u0440 \u0433\u043E\u0434\u0430 \u2013 \"2040\"";
        }
        // return userdate + "/12/31"
    };
    /**
    * Высчитывает даты Пасх в зависимости от введенной даты и сохраняет их значения в милисекундах.
    */
    TimeBoxOrthodox.prototype.calculateDatesEaster = function () {
        // Моммент в миллисекудах
        this.formatsEaster.momentMLS = this.theMoment.getTime();
        // Номер дня текущей даты.
        this.formatsEaster.dayNum = this.theMoment.getDay() + 1;
        // Берем год от даты
        this.formatsEaster.momentYear = this.formatsEaster.moment.getFullYear();
        // Формируем строку-дату Пасхи для введенного ГНГ
        this.formatsEaster.easter = this.formatsEaster.momentYear + "/" + this.paskhalia[this.formatsEaster.momentYear][0] + "/" + this.paskhalia[this.formatsEaster.momentYear][1];
        // Форматируем в млсек.
        var ddf = new Date(this.formatsEaster.easter);
        this.formatsEaster.easterMLS = ddf.getTime();
        // Конструктор для даты Пасхи
        var easter = new Date(this.formatsEaster.easterMLS);
        // количество дней до Пасхи (-); от Пасхи (+) в зависимости от знака результата вычисления
        this.keySystemYear = (this.formatsEaster.momentMLS - this.formatsEaster.easterMLS) / CONST_MLS_DAY;
        if (this.keySystemYear > 0) {
            var next = this.formatsEaster.momentYear + 1 + "/" + this.paskhalia[this.formatsEaster.momentYear + 1][0] + "/" + this.paskhalia[this.formatsEaster.momentYear + 1][1];
            this.formatsEaster.nextEasterMLS = new Date(next).getTime();
            this.formatsEaster.nextEaster = next;
            this.formatsEaster.lastEasterMLS = easter.getTime();
            this.formatsEaster.lastEaster = this.formatsEaster.easter;
        }
        else {
            var last = this.formatsEaster.momentYear - 1 + "/" + this.paskhalia[this.formatsEaster.momentYear - 1][0] + "/" + this.paskhalia[this.formatsEaster.momentYear - 1][1];
            this.formatsEaster.nextEasterMLS = easter.getTime();
            this.formatsEaster.nextEaster = easter.toString().slice(0, 15);
            this.formatsEaster.lastEasterMLS = new Date(last).getTime();
            this.formatsEaster.lastEaster = last;
        }
        this.mif();
        return "Мир всем!";
    };
    /**
     * Высчитывает Неделю мытаря и фарисея,
     * которая начинается за десять седмиц до Православной Пасхи.
     * Возвращает дату в формате слэш.
    */
    TimeBoxOrthodox.prototype.mif = function () {
        this.formatsEaster.mifMLS = this.formatsEaster.nextEasterMLS - CONST_MLS_MiF;
        this.formatsEaster.mif = new Date(this.formatsEaster.mifMLS).toString().slice(0, 15);
        return "\u0414\u0435\u043D\u044C \u043C\u044B\u0442\u0430\u0440\u044F \u0438 \u0444\u0430\u0440\u0438\u0441\u0435\u044F \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 " + this.formatsEaster.mif;
    };
    /**
     * Высчитывает дату Вознесения Господня для текущего БГ.
     */
    TimeBoxOrthodox.prototype.voznesnieGospodne = function () {
        this.formatsEaster.voznesenieMLS = this.formatsEaster.lastEasterMLS + (CONST_MLS_DAY * 39);
        this.formatsEaster.voznesenie = new Date(this.formatsEaster.voznesenieMLS).toString().slice(0, 15);
        return "\u0412\u043E\u0437\u043D\u0435\u0441\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 " + this.formatsEaster.voznesenie;
    };
    /**
     * Дата Пятидесятницы.
     * Возвращает дату Пятидесятницы для текущего БГ.
     */
    TimeBoxOrthodox.prototype.pyatDesyatnica = function () {
        this.formatsEaster.pyatiDesyatnicaMLS = this.formatsEaster.lastEasterMLS + (CONST_MLS_DAY * 49);
        this.formatsEaster.pyatiDesyatnica = new Date(this.formatsEaster.pyatiDesyatnicaMLS).toString().slice(0, 15);
        return "\u041F\u044F\u0442\u044C\u0434\u0435\u0441\u044F\u0442\u043D\u0438\u0446\u0430 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 " + this.formatsEaster.pyatiDesyatnica;
    };
    /**
     * Высчитывает  все что связано с седмицами.
     * Заполняет массив вычисленными данными.
     * Возвращает данные по седмицам (результаты вычислений).
     */
    TimeBoxOrthodox.prototype.calculateAllWeks = function () {
        this.formatsEaster.dayName = this.arayDays[this.theMoment.getDay()];
        // Количество седмиц в году.
        this.formatsEaster.allWeeks = parseInt((this.formatsEaster.nextEasterMLS - this.formatsEaster.lastEasterMLS)
            / CONST_MLS_DAY / 7 + "", 10);
        // Количество промежуточных седмиц пред МиФ. Отступка Богояввденская.
        this.formatsEaster.promWeeks = this.formatsEaster.allWeeks - 50;
        // TODO: // 436-2021-777 Выдает седмицу на единицу менее реальной из-за функции `parseInt()`
        // Текущая седмица от Пасхи.
        var sss = this.formatsEaster.currentWeek = parseInt((this.formatsEaster.momentMLS - this.formatsEaster.lastEasterMLS)
            / CONST_MLS_DAY / 7 + "", 10) + 1;
        // Седмица начала Великого поста (Святой
        // четыредесятницы)
        this.formatsEaster.beginningLentMLS = parseInt((this.formatsEaster.nextEasterMLS - CONST_MLS_DAY * 48) + "", 10);
        this.formatsEaster.beginningLent = new Date(this.formatsEaster.beginningLentMLS).toString().slice(0, 15);
        this.formatsEaster.currentWeekStupka = sss - this.formatsEaster.promWeeks;
        // Высчитываем остаток дней до Пасхи.
        var zero = parseInt((this.formatsEaster.nextEasterMLS - this.formatsEaster.momentMLS) / CONST_MLS_DAY + "", 10);
        var today = "Сегодня";
        // День Пасхи не входит в исчисление седмиц для БГ. На день Пасхи
        // приходится следущая седмица по счету, то есть на единицу более
        // последней седмицы. Проверка `zero` указывает на нулевую разницу
        // меджду случившейся Пасхой и данным моментом времени.
        if (zero == 0) {
            this.formatsEaster.ostatok = "СЕГОДНЯ ПАСХА ХРИСТОВА";
            today = "Сегодня";
            console.log("\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0421\u0432\u0435\u0442\u043B\u043E\u0435 \u0425\u0440\u0438\u0441\u0442\u043E\u0432\u043E \u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u0438\u0435. \u0425\u0440\u0438\u0441\u0442\u043E\u0441 \u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435!");
        }
        else {
            this.formatsEaster.ostatok = zero;
            today = "Остаток дней до Пасхи";
        }
        return today + " \u2013 " + this.formatsEaster.ostatok + " \n \u0411\u043E\u0433\u043E\u0441\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0445 \u0441\u0435\u0434\u043C\u0438\u0446 - " + this.formatsEaster.allWeeks + "\n \u041F\u0440\u043E\u043C\u0435\u0436\u0443\u0442\u043E\u0447\u043D\u044B\u0445 \u0441\u0435\u0434\u043C\u0438\u0446 - " + this.formatsEaster.promWeeks + " \n \u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0441\u0435\u0434\u043C\u0438\u0446\u0430 - " + this.formatsEaster.currentWeek + "\n \u0421\u0435\u0434\u043C\u0438\u0446\u0430 \u043F\u043E \u041F\u044F\u0442\u044C\u0434\u0435\u0441\u044F\u0442\u043D\u0438\u0446\u0435 - " + (this.formatsEaster.currentWeek - 7);
    };
    /**
     * Высчитывает количество седмиц до праздника Воздвижения.
     *
     * Возвращает количество дней - ступок.
     */
    // TODO: // 463-2021-333 !!! не сделано !!!
    TimeBoxOrthodox.prototype.vozdviggenieKresta = function () {
        var stupka = 0;
        var voz = "";
        var sliceLastEaster = this.formatsEaster.lastEaster;
        var sliceLastEaster2 = sliceLastEaster.slice(0, 4);
        this.formatsEaster.vozdviggenie = new Date(sliceLastEaster2 + "/9/27");
        this.formatsEaster.vozdviggenieMLS = this.formatsEaster.vozdviggenie.getTime();
        // В данной строке расчитывается количество седмиц от Недели Пятидесятницы до Недели Воздвижения Креста.
        // `- 6` в конце строки кода указывает на счет от Пятидесятницы.
        var kolichestvoSedmicPoPyatidesyatnice = (this.formatsEaster.vozdviggenieMLS - this.formatsEaster.lastEasterMLS) / CONST_MLS_DAY / 7 - 6;
        console.log("\u0421\u0435\u0434\u043C\u0438\u0446\u0430 \u043D\u0430 \u0412\u043E\u0437\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 - " + Math.floor(kolichestvoSedmicPoPyatidesyatnice));
        // Если `stupka` равна нулю, то отступки нет
        stupka = parseInt((kolichestvoSedmicPoPyatidesyatnice - 17).toString(), 10);
        if (stupka > 0 && this.formatsEaster.currentWeek < 27) {
            // это отступка (- единица, это коррекция для седмицы в
            // отличии от Недели)
            console.log("\u041E\u0442\u0441\u0442\u0443\u043F\u043A\u0430 \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 - " + stupka + " \u0441\u0435\u0434\u043C\u0438\u0446\u044B.");
            this.formatsEaster.vozStupka = stupka - 1;
            voz = "\u0412\u043E\u0437\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 " + kolichestvoSedmicPoPyatidesyatnice + " \u0441\u0435\u0434\u043C\u0438\u0446\u0443.\n                        \n\u041E\u0442\u0441\u0442\u0443\u043F\u043A\u0430 \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 - " + stupka + " \u0441\u0435\u0434\u043C\u0438\u0446\u044B.";
        }
        else if (stupka < 0 && this.formatsEaster.currentWeek <= 26) {
            // это преступка (+ единица, это коррекция для седмицы в
            // отличии от Недели)
            this.formatsEaster.vozStupka = stupka - 1;
            voz = "\u0412\u043E\u0437\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 " + kolichestvoSedmicPoPyatidesyatnice + " \u0441\u0435\u0434\u043C\u0438\u0446\u0443.\n                        \n\u041F\u0440\u0435\u0441\u0442\u0443\u043F\u043A\u0430 \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 -  " + stupka + " \u0441\u0435\u0434\u043C\u0438\u0446\u044B.";
        }
        else {
            voz = "\u0412\u043E\u0437\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u043D\u0430 \u0441\u0435\u0434\u043C\u0438\u0446\u0443 - " + kolichestvoSedmicPoPyatidesyatnice + ".\n \u041E\u0442\u0441\u0442\u0443\u043F\u043E\u043A \u043D\u0435\u0442.";
        }
        return voz;
    };
    TimeBoxOrthodox.prototype.vhodGospoden = function () {
        // if(this.keySystemYear != 0){
        this.formatsEaster.vhodMLS = this.formatsEaster.nextEasterMLS - CONST_MLS_DAY * 7;
        this.formatsEaster.vhod = new Date(this.formatsEaster.vhodMLS).toString().slice(0, 15);
        return "\u0412\u0445\u043E\u0434 \u0413\u043E\u0441\u043F\u043E\u0434\u0435\u043D\u044C \u0432\u043E \u0418\u0435\u0440\u0443\u0441\u0430\u043B\u0438\u043C: " + this.formatsEaster.vhod;
        // } else {
        // console.log(CONST_LOG_WARNING)
        //   return ER_606
        // }
    };
    TimeBoxOrthodox.prototype.calculateLinksAll = function () {
        var ccc = 0;
        // TODO: 11-2021
        this.formatsLinks.linkToAprakosPage = this.formatsEaster.currentWeek + '/' + this.formatsEaster.dayNum + '.html';
        // TODO: // корректировка отступки  для ссылок в древе на id седмицы /// 444-2021-555
        if (this.formatsEaster.currentWeek > 40 && this.formatsEaster.promWeeks > 0) {
            ccc = this.formatsEaster.currentWeekStupka;
            // TODO: // Требуется откорректировать ссылку с учётом отступки.
            this.formatsLinks.linkToAprakosPage = ccc + '/' + this.formatsEaster.dayNum + '.html';
            this.formatsLinks.linkToElementID2 = "<a href=\"#seed" + ccc + "\"  title=\"\u0421\u0435\u0433\u043E\u0434\u043D\u044F : " + this.formatsEaster.dayName + "\">" + (this.formatsEaster.promWeeks + ccc) + "</a>";
            this.formatsLinks.linkToElementID4 = "<a href=\"#seed" + ccc + "\"  title=\"\u0421\u0435\u0433\u043E\u0434\u043D\u044F : " + this.formatsEaster.dayName + "\">" + (this.formatsEaster.promWeeks + ccc - 7) + "</a>";
        }
        else if (this.formatsEaster.currentWeek > 21 && this.formatsEaster.currentWeek < 27) {
            ccc = this.formatsEaster.currentWeek - this.formatsEaster.vozStupka;
            this.formatsLinks.linkToAprakosPage = ccc + '/' + this.formatsEaster.dayNum + '.html';
            this.formatsLinks.linkToElementID2 = "<a href=\"#seed" + ccc + "\"  title=\"\u0421\u0435\u0433\u043E\u0434\u043D\u044F : " + this.formatsEaster.dayName + "\">" + this.formatsEaster.currentWeek + "</a>";
            this.formatsLinks.linkToElementID4 = "<a href=\"#seed" + ccc + "\"  title=\"\u0421\u0435\u0433\u043E\u0434\u043D\u044F : " + this.formatsEaster.dayName + "\">" + (this.formatsEaster.currentWeek - 7) + "</a>";
        }
        else {
            var ccc_1 = this.formatsEaster.currentWeek;
            this.formatsLinks.linkToElementID2 = "<a href=\"#seed" + ccc_1 + "\"  title=\"\u0421\u0435\u0433\u043E\u0434\u043D\u044F : " + this.formatsEaster.dayName + "\">" + ccc_1 + "</a>";
            this.formatsLinks.linkToElementID4 = "<a href=\"#seed" + ccc_1 + "\"  title=\"\u0421\u0435\u0433\u043E\u0434\u043D\u044F : " + this.formatsEaster.dayName + "\">" + (ccc_1 - 7) + "</a>";
        }
    };
    /**
     * Метод встраивает и изменяет элементы DOM
     *
     * В методе корректируется данные, которые задают ссылку на id-элемент страницы.
     * Также, в данном месте, нужно вывести date3 в DOM название для блока.
     * Это название выводиться всегда и в ином виде только для первой седмицы.
     * На главной странице вид счета седмиц должен оставаться неизменным и последовательным.
     * Ссылка же на id-элемент страницы  изменяется с учётом отступок и преступок.
     *
     * TODO:  Требуется добавить код для вычисления Воздвиженской отступки. /// 445-2021-555
     */
    TimeBoxOrthodox.prototype.insertElements = function () {
        this.glasSedmici();
        // Вставляем глас седмицы по Октоиху
        document.getElementById('date5').innerHTML = "\u0413\u043B\u0430\u0441 \u0441\u0435\u0434\u043C\u0438\u0446\u044B - " + this.formatsEaster.glas;
        var description = "Метод класса. Вставляет элементы DOM.";
        if (this.formatsEaster.currentWeekStupka < 51) {
            document.getElementById('date2').innerHTML = this.formatsLinks.linkToElementID2;
            document.getElementById('date4').innerHTML = this.formatsLinks.linkToElementID4;
        }
        else {
            document.getElementById('date').innerHTML = "ХРИСТОС ВОСКРЕСЕ!";
            document.getElementById('date').className += " XB";
        }
        if (this.formatsEaster.currentWeek > 7) {
            document.getElementById('date3').innerHTML = "По Пятидесятнице";
        }
        else if (this.formatsEaster.currentWeek == 1) {
            document.getElementById('date3').innerHTML = "СВЕТЛАЯ СЕДМИЦА";
            document.getElementById('date4').remove();
        }
        else {
            // здесь можно разместить код для 49 дней по Пасхе 
            document.getElementById('date3').remove();
            document.getElementById('date4').remove();
            document.getElementById('date5').remove();
        }
        // Выделение блока текущей седмицы.
        var slb, vvv = "seed";
        var seedday = "none";
        if (this.formatsEaster.currentWeek > 40 && this.formatsEaster.ostatok > 70) {
            //  если есть отступка, меняем цвет и
            //  добавляем классы `.colorBlock .promWeeks`
            vvv = vvv + this.formatsEaster.currentWeekStupka;
            slb = " colorBlock promWeek";
            document.getElementById(vvv).style.backgroundColor = '#d5d5d5';
            seedday = "seedday-" + this.formatsEaster.currentWeekStupka + "-" + this.formatsEaster.dayNum;
        }
        // =-=-=-=-=-=-=-=-=
        if (this.formatsEaster.currentWeek > 40 && this.formatsEaster.ostatok < 70) {
            //  отступка закончилась, меняем цвет на обратный и
            // оставляем счет седмиц с учетом отступки
            vvv = vvv + this.formatsEaster.currentWeekStupka;
            slb = " colorBlock";
            // document.getElementById(vvv).style.backgroundColor = '#d5d5d5';
            seedday = "seedday-" + this.formatsEaster.currentWeekStupka + "-" + this.formatsEaster.dayNum;
        }
        // Оформление блока на время отступки до Воздвижения Креста.
        if (this.formatsEaster.currentWeek >= 22 && this.formatsEaster.currentWeek <= 27 && this.formatsEaster.vozStupka > 0) {
            vvv = vvv + (this.formatsEaster.currentWeek - this.formatsEaster.vozStupka);
            slb = " colorBlock";
            seedday = "seedday-" + (this.formatsEaster.currentWeek - this.formatsEaster.vozStupka) + "-" + this.formatsEaster.dayNum;
        }
        else if (this.formatsEaster.currentWeek >= 22 && this.formatsEaster.currentWeek <= 27 && this.formatsEaster.vozStupka < 0) {
            vvv = vvv + (this.formatsEaster.currentWeek - this.formatsEaster.vozStupka);
            slb = " colorBlock";
            seedday = "seedday-" + (this.formatsEaster.currentWeek - this.formatsEaster.vozStupka) + "-" + this.formatsEaster.dayNum;
        }
        else if (this.formatsEaster.currentWeek <= 40) {
            vvv = vvv + this.formatsEaster.currentWeek;
            slb = " colorBlock";
            seedday = "seedday-" + this.formatsEaster.currentWeek + "-" + this.formatsEaster.dayNum;
        }
        // TODO: // Требуется продолжить скрипт на условиях дальнейшего распротранения. 436-2021-555
        // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        // День Пасхи приходится на начало следующей седмицы по системному календарю, которая числом превышает
        // допущенный диаппазон с учетом отступок в 50 седмиц. Поэтому при наступлении исключения
        // делается редирект на Пасхальный канон.  Достсуп же ко всем другим зачалам закрывается.
        document.getElementById(seedday).className += 'ON';
        document.getElementById(vvv).className += slb;
        // alert("Xристос Bоскрксе!\nСегодня светлое Христово Воскресение!")
        //
        // document.location.replace('1/1.html')
        // console.log('-=-=-=-=-=-',vvv, colorBlockID)
        return description;
    };
    return TimeBoxOrthodox;
}()); // end class
/**
 * Экземпляр по умолчанию с именем `apr`. Для получения дат другого Богослужебного года установите в скрипт свой экземпляр передав в параметре конструктора нужный вам год, например так:
 *
 * ```typescript
 * let apr = new TimeBoxOrthodox("2037")
 * ```
 *
 */
// 
var apr = new TimeBoxOrthodox();
