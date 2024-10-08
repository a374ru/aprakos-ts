# TYPEDOC генератор

>Здесь речь о генераторе документации для данного проекта писанного на языке `TypeScript`.

## Установка и запуск

Ознакомиться и установить программу генерации документации для `TypeScript` можно по ссылке […здесь](https://typedoc.org/) или просто набрав `typedoc` в интернете. Послевыполнения инструкций по установке и настройке приложения `Typedoc`, выполним далее самые простые и необходимые шаги для данного проекта, подойдет и как пример для других проектов.


## Настройка конфигурации

В корне проекта создайте файл `typedoc.json` и внесите в него необходимый код:

1. Точку входа (…что).
2. Точку выхода (…куда).
3. Название (Именование проекта).
4. Название темы (`defalt` или `minimal`).

```js
{
   "entryPoints": ["main/aprakos.ts"],
   "out": "docs/generated",
   "name": "Aprakos-TS",
   "theme": "default"
}
```

<br>

### <span style="color: #e34234;">Обратите внимание на путь точки выхода.</span>

>В папке `docs` находятся только файлы `markdown`, а сгенерированная документация во вложенной папке `generated`. Такая архитектура важна для корректного отображения во всех местах расположения ресурсов; это `github`, `readthedocs` и `github-pages`. Именно при таком раскладе материалов сохраняется все правильно для всех случаев публикации.

<br>

## Запуск генератора `typedoc` с опциями

Здесь мы запускаем `typedoc` с опциями `--options` из файла `typedoc.json`


```zsh
npx typedoc --options ../typedoc.json
```

## Простая сборка 

Здесь мы выполним сборку из папки скрипта и автоматически получим на выходе вложенную папку `docs` с документацией.

```zsh
npx typedoc 
```

## Добавление документации

Если нужно добавить всю документацию `markdown`,то добавьте в `typedoc.json` эту строку:

```sh
"projectDocuments": ["my_folder/*.md"]
```

Или перечислите все файлы нужные по именно:

```sh
"projectDocuments": [
   "my_folder/a.md", 
   "my_folder/b.md",
   "my_folder/c.md",
]
```

<br><br>
![img](assets/img/the_end.png)