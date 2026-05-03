function setupProgressAndAutoPlayNext() {
    const video = document.getElementById('video-player');

    // 1. Періодичний запис кожні 60 секунд (якщо відео грає)
    let saveInterval = setInterval(() => {
        if (!video.paused) {
            localStorage.setItem(`lampa_time_series_${window.currentSeriesIndex}`, video.currentTime);
        }
    }, 60000);

    // 2. Збереження при натисканні на паузу
    video.addEventListener('pause', function () {
        localStorage.setItem(`lampa_time_series_${window.currentSeriesIndex}`, video.currentTime);
    });

    // 3. Збереження перед закриттям вкладки або вікна (якщо користувач закриває плеєр)
    window.addEventListener('beforeunload', function () {
        localStorage.setItem(`lampa_time_series_${window.currentSeriesIndex}`, video.currentTime);
    });

    // 4. Слухаємо подію закінчення відео
    video.addEventListener('ended', function () {
        clearInterval(saveInterval); // Зупиняємо таймер для поточного відео
        
        // Зберігаємо 0 перед переходом, щоб нова серія починалася з початку
        localStorage.setItem(`lampa_time_series_${window.currentSeriesIndex}`, 0);

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
