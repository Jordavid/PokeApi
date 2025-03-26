//Elementos del DOM
const serchTypeRadios = document.querySelectorAll('input[name="searchType"]');
const pokemonIdInput = document.getElementById('pokemonId');
const pokemonNameInput = document.getElementById('pokemonName');
const searchBtn = document.getElementById('searchBtn');
const pokemonInfo = document.getElementById('pokemonInfo');
const pokemonNameTitle = document.getElementById('pokemonNameTitle');
const pokemonIamge = document.getElementById('pokemonImage');

const pokemonTypes = document.getElementById('pokemonTypes');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');

const detailsBtn = document.getElementById('detailsBtn');
const moreDatails = document.getElementById('moreDetails');
const pokemonStats = document.getElementById('pokemonStats');
const pokemonAbilities = document.getElementById('pokemonAbilities');

//Tipo de busqueda por el radio seleccionado
serchTypeRadios.forEach(radio => {
    radio.addEventListener('change', function(){
        pokemonIdInput.disabled = this.value !== 'id';
        pokemonNameInput.disabled = this.value !== 'name';
    });
});



//Funcion para buscar pokemon
searchBtn.addEventListener('click', async function() {
    let param;
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    if(searchType === 'random'){
        param = Math.floor(Math.random() * 150) + 1;
    } else if(searchType === 'name'){
        param = pokemonNameInput.value.toLowerCase().trim();
        if(!param){
            alert('Ingrese un nombre de Pokemon');
            return;
        }
    } else {
        param = pokemonIdInput.value;
        if(param < 1 || param > 150){
            alert('Ingresa un ID entre 1 y 150');
            return;
        }
    }

    try{
        const pokemon = await pokeApi(param);
        pokemonInfoDetails(pokemon);
    } catch (error){
        alert('No se encontro el pokemon')
        console.log('Error', error);
    }
});

//Mostrar detalles adicionales
detailsBtn.addEventListener('click', function(){
    moreDatails.classList.toggle('hidden');
    this.textContent = moreDatails.classList.contains('hidden') ?
        'Ver mas detalles' : 'Ocultar detalles';
})

// Funcion para consumir la API
async function pokeApi(param) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${param}`);
    if(!response.ok){
        throw new Error('Pokemon no encontrado');
    }
    return await response.json();
}


//Muestra la informacion basica del pokemon
function pokemonInfoDetails(pokemon) {
    pokemonInfo.classList.remove('hidden');
    moreDatails.classList.add('hidden');
    detailsBtn.textContent = 'Ver mas detalles';

    pokemonNameTitle.textContent = `#${pokemon.id} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
    pokemonIamge.src = pokemon.sprites.front_default;

    pokemonTypes.innerHTML = pokemon.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ');

    pokemonHeight.textContent = (pokemon.height / 10).toFixed(1);
    pokemonWeight.textContent = (pokemon.weight / 10).toFixed(1);

    // Estadisticas
    pokemonStats.innerHTML = pokemon.stats.map(stat => 
        `<li>${stat.stat.name}: ${stat.base_stat}</li>`
    ).join('');

    //Habilidades
    pokemonAbilities.innerHTML = pokemon.abilities.map(ability => 
        `<li> ${ability.ability.name.replace('-', ' ')} ${ability.is_hidden ? ' (oculta)' : ''}</li>`
    ).join('');
}