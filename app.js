// Дані для нашого макету (замість цього в майбутньому можна підключити парсер сайту)
const dummyMovies = [
    { title: 'Дюна: Частина друга', year: 2024, image: 'https://picsum.photos/180/270?random=1' },
    { title: 'Фуріоза: Шалений Макс', year: 2024, image: 'https://picsum.photos/180/270?random=2' },
    { title: 'Повстання штатів', year: 2024, image: 'https://picsum.photos/180/270?random=3' },
    { title: 'Дум гроші', year: 2023, image: 'https://picsum.photos/180/270?random=4' }
];

function loadCategory(category) {
    // Змінюємо виділення кнопок меню
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Оновлюємо список фільмів
    renderMovies(dummyMovies);
}

function renderMovies(moviesList) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';

    moviesList.forEach((movie, index) => {
        const cardHTML = `
            <div class="card" tabindex="${index + 1}" onclick="playMovie('${movie.title}')">
                <img src="${movie.image}" alt="${movie.title}">
                <div class="card-info">
                    <div class="card-title">${movie.title}</div>
                    <div style="color:#666; font-size:12px;">${movie.year}</div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function playMovie(title) {
    alert(`Запуск відтворення: ${title}`);
}

function openUaWebsite() {
    window.open('https://uakino.club', '_blank');
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    renderMovies(dummyMovies);
});
