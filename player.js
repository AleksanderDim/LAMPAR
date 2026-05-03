// Модуль плеєра з підтримкою вибору плеєра, списку серій, автоперемиканням та збереженням прогресу

function initPlayer(videoUrl, seriesData = []) {
    // Зберігаємо дані серій
    window.currentSeriesData = seriesData;
    
    // Перевіряємо, чи є збережений прогрес (індекс та час)
    const savedIndex = localStorage.getItem('lampa_series_index');
    window.currentSeriesIndex = savedIndex !== null ? parseInt(savedIndex) : 0;

    // Створюємо фоновий контейнер для плеєра
    const playerOverlay = document.createElement('div');
    playerOverlay.id = 'player-overlay';
    playerOverlay.style.position = 'fixed';
    playerOverlay.style.top = '0';
    playerOverlay.style.left = '0';
    playerOverlay.style.width = '100vw';
    playerOverlay.style.height = '100vh';
    playerOverlay.style.backgroundColor = '#121212';
    playerOverlay.style.zIndex = '1000';
    playerOverlay.style.display = 'flex';
    playerOverlay.style.flexDirection = 'column';

    playerOverlay.innerHTML = `
        <div style="display: flex; justify-content: space-between; padding: 20px; width: 100%; background-color: #1a1a1a;">
            <div style="font-size: 20px; font-weight: bold; color: #e50914;">UAKino - Перегляд</div>
            <div style="font-size: 18px; color: #ccc; cursor: pointer;" onclick="closePlayer()">&#10006; Закрити</div>
        </div>

        <div style="display: flex; width: 100%; height: calc(100vh - 80px); padding: 40px; gap: 40px;">
            <div style="flex: 2; display: flex; flex-direction: column; gap: 20px;">
                <div style="width: 100%; aspect-ratio: 16/9; background-color: #000; border-radius: 8px; overflow: hidden;">
                    <video id="video-player" controls autoplay style="width: 100%; height: 100%;">
                        <source src="${videoUrl}" type="application/x-mpegURL">
                        Ваш браузер не підтримує відеопотік.
                    </video>
                </div>
                
                <div style="background: #1e1e1e; padding: 15px; border-radius: 6px;">
                    <label style="color: #888; font-size: 14px;">Оберіть плеєр:</label>
                    <select id="player-type" style="margin-left: 10px; padding: 6px; background: #333; color: #fff; border: none; border-radius: 4px;">
                        <option value="internal">Вбудований (HTML5)</option>
                        <option value="vlc">Відкрити у VLC / Зовнішній плеєр</option>
                    </select>
                    <button onclick="applyPlayer()" style="margin-left: 10px; padding: 6px 12px; background: #e50914; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Застосувати</button>
                </div>
            </div>

            <div style="flex: 1; background-color: #1a1a1a; padding: 20px; border-radius: 8px; overflow-y: auto;">
                <h3 style="margin-bottom: 15px; color: #fff;">Сезон 1</h3>
                <div id="series-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
        </div>
    `;

    document.body.appendChild(playerOverlay);

    renderSeries(seriesData);
    setupProgressAndAutoPlayNext();
    playSeriesByIndex(window.currentSeriesIndex); // Запуск із збереженої серії
}

function renderSeries(seriesList) {
    const listContainer = document.getElementById('series-list');
    if (!listContainer) return;

    if (seriesList.length === 0) {
        listContainer.innerHTML = '<div style="color: #666;">Серії не знайдені або це фільм.</div>';
        return;
    }

    listContainer.innerHTML = '';

    seriesList.forEach((series, index) => {
        const btn = document.createElement('button');
        btn.style.padding = '12px';
        btn.style.background = '#282828';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.innerText = series.title || `Серія ${index + 1}`;

        btn.onmouseover = function () { this.style.background = '#e50914'; };
        btn.onmouseout = function () { this.style.background = '#282828'; };

        btn.onclick = function () {
            window.currentSeriesIndex = index;
            playSeriesByIndex(index);
        };

        listContainer.appendChild(btn);
    });
}

function playSeriesByIndex(index) {
    const seriesList = window.currentSeriesData;
    if (seriesList && seriesList[index]) {
        const video = document.getElementById('video-player');
        video.src = seriesList[index].url;
        
        // Відновлюємо збережений час для цієї серії (якщо він є)
        const savedTime = localStorage.getItem(`lampa_time_series_${index}`);
        video.currentTime = savedTime ? parseFloat(savedTime) : 0;
        
        video.play();
        localStorage.setItem('lampa_series_index', index);
    }
}

function setupProgressAndAutoPlayNext() {
    const video = document.getElementById('video-player');

    // 1. Записуємо час кожні 5 секунд під час перегляду
    video.addEventListener('timeupdate', function () {
        localStorage.setItem(`lampa_time_series_${window.currentSeriesIndex}`, video.currentTime);
    });

    // 2. Слухаємо подію закінчення відео
    video.addEventListener('ended', function () {
        const seriesList = window.currentSeriesData;
        if (seriesList && seriesList.length > 0) {
            window.currentSeriesIndex += 1;

            if (window.currentSeriesIndex < seriesList.length) {
                playSeriesByIndex(window.currentSeriesIndex);
            } else {
                window.currentSeriesIndex = 0;
                localStorage.setItem('lampa_series_index', 0);
                console.log("Усі серії переглянуто.");
            }
        }
    });
}

function applyPlayer() {
    const playerType = document.getElementById('player-type').value;
    const video = document.getElementById('video-player');

    if (playerType === 'vlc') {
        const currentUrl = video.currentSrc;
        const vlcUrl = `vlc://${currentUrl}`;
        window.open(vlcUrl, '_blank');
        video.pause();
    }
}

function closePlayer() {
    const video = document.getElementById('video-player');
    if (video) {
        // Зберігаємо поточний час перед закриттям
        localStorage.setItem(`lampa_time_series_${window.currentSeriesIndex}`, video.currentTime);
    }
    
    const player = document.getElementById('player-overlay');
    if (player) {
        player.remove();
    }
}
