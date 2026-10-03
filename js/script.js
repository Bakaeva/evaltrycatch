// Функция фильтрации массива значений по типу данных
// Параметры:
//   type - один из типов данных: 'number', 'string', 'boolean'
//   ...values - произвольное количество значений, помещённых в массив values (rest parameters)
// Возвращает массив значений типа, указанного в I параметре
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	// Функция скрывает все блоки с ответами на странице	
	hideAllResponseBlocks = () => {
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block')); // все элементы страницы с классом 'dialog__response-block' помещаются в список NodeList, который затем преобразуется в массив
		responseBlocksArray.forEach(block => block.style.display = 'none'); // путём перебора массива блоков с ответами, скрывается каждый блок
	},

	// Функция показывает конкретный блок ответа и заполняет его текстом сообщения
	// Параметры:
	//   blockSelector - селектор блока,
	//   msgText - текст сообщения,
	//   spanSelector - селектор для span-элемента
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		hideAllResponseBlocks();  // сначала скрываются все блоки ответов
		document.querySelector(blockSelector).style.display = 'block'; // затем показывается нужный блок

		if (spanSelector) { // и если передан селектор для span-элемента,
			document.querySelector(spanSelector).textContent = msgText; // то ищется по нему span-элемент и вставляется в него текст сообщения
		}
	},

	// Функция показывает блок с ошибкой
	// Параметр msgText - текст ошибки - передаётся в вызываемую функцию showResponseBlock() с нужными селекторами
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	// Функция показывает блок с успешными результатами
	// Параметр msgText - текст результата - передаётся в вызываемую функцию showResponseBlock() с нужными селекторами
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	// Функция показывает блок "нет результатов" (без текста)
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	// Функция пытается выполнить функцию filterByType() с обработкой ошибок
	// Параметры:
	//   type - тип данных,
	//   values - строка значений для фильтрации
	tryFilterByType = (type, values) => {
		// блок try-catch для обработки возможных ошибок
		try {
			// используется eval для выполнения строки кода - вызова функции filterByType с переданными параметрами,
			// затем значения возвращаемого массива объединяются через запятую в строку:
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			// формируется сообщение: если массив не пустой - показываем результаты, иначе - сообщение об отсутствии данных:
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			showResults(alertMsg); // вызывается функция, которая показывает блок с успешными результатами и текстом сообщения
		} catch (e) {
			showError(`Ошибка: ${e}`); // если произошла ошибка, то вызывается функция, которая показывает блок с ошибкой
		}
	};

const filterButton = document.querySelector('#filter-btn'); // на странице ищется по id кнопка фильтрации

// на найденную кнопку фильтрации добавляем слушателя события нажатия (обработчик)
filterButton.addEventListener('click', e => {
	const typeInput = document.querySelector('#type'); // на странице ищется по id поле ввода для типа данных
	const dataInput = document.querySelector('#data'); // на странице ищется по id поле ввода для данных

	if (dataInput.value === '') { // если поле данных пустое,
		dataInput.setCustomValidity('Поле не должно быть пустым!'); // то устанавливается кастомное сообщение об ошибке валидации
		showNoResults(); // и вызывается функция, которая показывает блок "нет результатов"
	} else { // если поле не пустое,
		dataInput.setCustomValidity(''); // то очищается кастомное сообщение об ошибке
		e.preventDefault(); // предотвращается стандартное поведение формы
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); // вызывается функция фильтрации с обработкой ошибок (с предварительной обрезкой пробелов в передаваемых аргументах)
	}
});
