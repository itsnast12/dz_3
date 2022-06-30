const wordElement = document.querySelector('#word-form');
const searchElement = document.querySelector('#search-form');
const cardsElement = document.querySelector('#cards');

const get_cards = () => JSON.parse(localStorage.getItem('cards')) || [];

const add_card = card => localStorage.setItem('cards',JSON.stringify([...get_cards(),card]));

const remove_card = card => {
	const new_lst = get_cards().filter(elem => JSON.stringify(elem) !== JSON.stringify(card));
	localStorage.setItem('cards', JSON.stringify(new_lst)); 
}

wordElement.addEventListener('submit',event => {
	event.preventDefault();
	const {word,translation, color} = event.target;
	add_card({
		word: word.value,
		translation: translation.value,
		color: color.value
	});

	render(get_cards());
		word.value ='',
		translation.value ='',
		color.value =''
});

function render(lst){

	const cardsElem = document.querySelector('#cards');
	cardsElem.innerText = '';
	if(get_cards().length){
		cardsElem.append(
			...get_cards().map(card=>{
				const {word,translation, color} = card;
				const rootElem = document.createElement('div');
				rootElem.classList.add('cards');

				const infoElem = document.createElement('div');

				let p = document.createElement('p');
				p.classList.add('text');

				p.innerText = word;

				infoElem.classList.add('card');
				infoElem.style.backgroundColor = color;
				const denBtnElem = document.createElement('div');
				denBtnElem.innerHTML = 'X';
				denBtnElem.classList.add('close');
				infoElem.addEventListener('dblclick', () => {
					if (p.innerText === word) {
						p.innerText = translation;
					} else {
						p.innerText = word;
					}
				});
				denBtnElem.addEventListener('click', ()=>{
					remove_card(card);
					render();
				})

				infoElem.append(p,denBtnElem);
				
				return infoElem;
			})
		)
	}else{
		const infoElem = document.createElement('p');
		infoElem.classList.add('empty_info');
		infoElem.innerText = 'У вас нет карточек для изучения!';
		cardsElem.append(infoElem);
	}
}

function renderSearch(list) {
	cardsElement.innerHTML = '';

	for (let elem of list) {
		let card = document.createElement('div');
		let close = document.createElement('div');
		let p = document.createElement('p');
		close.addEventListener('click', () => 
			card.remove());

		p.classList.add('text');
		card.classList.add('card');
		close.classList.add('close');
		card.append(p, close);

		p.innerText = elem.word;
		card.style.backgroundColor = elem.color;
		close.innerText = 'Х';

		card.addEventListener('dblclick', () => {
			if (p.innerText === elem.word) {
				p.innerText = elem.translation;
			} else {
				p.innerText = elem.word;
			}
		});

		cardsElement.append(card);
	}
}

searchElement.addEventListener('submit', function (event) {
	event.preventDefault();
	renderSearch(get_cards().filter(elem => this.search.value === '' || JSON.stringify(elem.word) === JSON.stringify(this.search.value)));
});

render(get_cards());