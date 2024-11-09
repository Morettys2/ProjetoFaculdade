// Declara o array para armazenar todos os Pokémon carregados
let allPokemons = [];

// Função para carregar todos os Pokémon de até um limite
async function loadPokemons(limit = 150) {
    const promises = []; // Armazena as promessas de fetch para melhorar a eficiência
    for (let i = 1; i <= limit; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(response => response.json()));
    }
    allPokemons = await Promise.all(promises); // Aguarda todas as promessas serem resolvidas
    // Exibe os 12 primeiros Pokémon após o carregamento completo
    displayPokemons(allPokemons.slice(0, 12));

    // Carrega a imagem do Charizard shiny
    loadCharizardImage();
}

// Função para carregar a imagem do Charizard shiny
async function loadCharizardImage() {
    const charizard = await fetch(`https://pokeapi.co/api/v2/pokemon/6`).then(response => response.json());
    const charizardImageElement = document.getElementById("charizard-shiny");
    charizardImageElement.src = charizard.sprites.front_shiny; // Define o src da imagem
    charizardImageElement.alt = "Charizard Shiny"; // Atualiza a descrição da imagem
}

// Função para exibir uma lista de Pokémon ou uma mensagem de erro
function displayPokemons(pokemonList) {
    const cardContainer = document.querySelector(".card-container");
    if (!cardContainer) {
        console.error("Elemento .card-container não encontrado.");
        return;
    }

    cardContainer.innerHTML = ''; // Limpa os cards existentes

    if (pokemonList.length === 0) {
        // Exibe uma mensagem de erro centralizada se não encontrar Pokémon
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Nenhum Pokémon encontrado.';
        errorMessage.style.color = '#333';
        errorMessage.style.fontSize = '18px';
        errorMessage.style.textAlign = 'center';
        errorMessage.style.padding = '20px';
        cardContainer.appendChild(errorMessage);
        return;
    }

    // Cria os cards para os Pokémon encontrados
    pokemonList.forEach((pokemon) => {
        const card = createPokemonCard(pokemon);
        cardContainer.appendChild(card);
    });
}

// Função para criar um card de Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'card';

    const cardImage = document.createElement('div');
    cardImage.className = 'card-image';
    cardImage.style.backgroundImage = `url(${pokemon.sprites.front_default})`;

    const pokemonName = document.createElement('h3');
    pokemonName.textContent = capitalizeFirstLetter(pokemon.name); // Função para capitalizar a primeira letra

    const pokemonType = document.createElement('p');
    const types = pokemon.types.map(typeInfo => translateType(typeInfo.type.name)).join(', '); // Utiliza função para traduzir tipos

    pokemonType.textContent = `Tipo: ${types}`;
    card.appendChild(cardImage);
    card.appendChild(pokemonName);
    card.appendChild(pokemonType);

    return card;
}

// Função para capitalizar a primeira letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para traduzir tipos de Pokémon de inglês para português
function translateType(type) {
    const typeNames = {
        "normal": "Normal",
        "fire": "Fogo",
        "water": "Água",
        "grass": "Planta",
        "electric": "Elétrico",
        "ice": "Gelo",
        "fighting": "Lutador",
        "poison": "Venenoso",
        "ground": "Terra",
        "flying": "Voador",
        "psychic": "Psíquico",
        "bug": "Inseto",
        "rock": "Pedra",
        "ghost": "Fantasma",
        "dragon": "Dragão",
        "dark": "Sombrio",
        "steel": "Aço",
        "fairy": "Fada"
    };
    return typeNames[type] || type; // Retorna o nome traduzido ou o próprio tipo se não houver tradução
}

// Adiciona evento de entrada para filtrar Pokémon
document.getElementById("search-input").addEventListener('input', filterPokemons);

// Função para filtrar Pokémon baseado no tipo ou nome
function filterPokemons() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const cardContainer = document.querySelector(".card-container");

    // Verifica se o contêiner de cards existe
    if (!cardContainer) {
        console.error("Elemento .card-container não encontrado.");
        return;
    }

    // Limpa os cards iniciais para exibir apenas os resultados da pesquisa
    cardContainer.innerHTML = '';

    // Filtra Pokémon de acordo com o tipo ou nome pesquisado, limitando a 12 resultados
    const filteredPokemons = allPokemons
        .filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchInput) || // Filtra pelo nome
            pokemon.types.some(typeInfo => translateType(typeInfo.type.name).toLowerCase().includes(searchInput)) // Filtra pelo tipo
        )
        .slice(0, 12); // Limita a 12 Pokémon para exibir apenas 12 resultados

    // Exibe os Pokémons filtrados ou uma mensagem de erro
    displayPokemons(filteredPokemons);
}

// Chama a função para carregar todos os Pokémon assim que a página é carregada
window.onload = () => loadPokemons(150);



