// Модуль парсингу даних з UAKino з підтримкою зміни доменів та повідомленням про помилку

const UAKINO_DOMAINS = [
    'https://uakino.best',
    'https://uakino.club',
    'https://uakino.org',
    'https://uakino.co'
];

async function checkDomainAndFetch(path = '') {
    for (const domain of UAKINO_DOMAINS) {
        try {
            const testUrl = `${domain}/${path}`;
            console.log(`Перевіряємо доступність: ${testUrl}`);
            
            // Для прикладу імітуємо успішну відповідь:
            return {
                activeDomain: domain,
                items: [
                    {
                        title: 'Дюна: Частина друга',
                        year: 2024,
                        image: 'https://picsum.photos/180/270?random=20',
                        quality: 'HDRip'
                    }
                ]
            };
        } catch (e) {
            console.warn(`Домен ${domain} недоступний.`);
        }
    }
    
    // Якщо жоден домен не відповів, показуємо повідомлення про помилку
    showUpdateWarning();
    throw new Error('Усі дзеркала UAKino недоступні');
}

function showUpdateWarning() {
    // Шукаємо контейнер для фільмів
    const container = document.getElementById('movies-container');
    if (container) {
        container.innerHTML = `
            <div style="
                grid-column: 1/-1; 
                background-color: #242424; 
                padding: 40px; 
                border-radius: 8px; 
                text-align: center; 
                color: #fff;
                border: 2px solid #e50914;
            ">
                <h3 style="color: #e50914; margin-bottom: 15px;">⚠️ Помилка: Ресурс недоступний</h3>
                <p style="color: #ccc; margin-bottom: 20px; line-height: 1.5;">
                    Не вдалося підключитися до жодного із відомих джерел UAKino. Можливо, всі домени змінилися.<br>
                    Вам потрібно оновити список актуальних адрес у файлі <strong>parser.js</strong> на вашому GitHub.
                </p>
                <div style="background: #1a1a1a; padding: 15px; border-radius: 6px; display: inline-block; text-align: left;">
                    <p style="color: #888; font-size: 14px; margin-bottom: 8px;">Як це зробити:</p>
                    <ol style="padding-left: 20px; color: #ddd; font-size: 14px; line-height: 1.6;">
                        <li>Знайдіть новий актуальний домен UAKino через пошук.</li>
                        <li>Відредагуйте файл <code>parser.js</code> у своєму репозиторії.</li>
                        <li>Додайте новий домен до масиву <code>UAKINO_DOMAINS</code>.</li>
                    </ol>
                </div>
            </div>
        `;
    }
}

async function fetchUaKinoData(category = 'films') {
    try {
        const result = await checkDomainAndFetch(category);
        return result.items || [];
    } catch (error) {
        console.error('Помилка парсингу:', error);
        return [];
    }
}
