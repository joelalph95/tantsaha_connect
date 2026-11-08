<!DOCTYPE html>
<html lang="mg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ora sy Toetr'andro Malagasy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
            min-height: 100vh;
            padding: 0;
            overflow-x: hidden;
        }

        /* Barre de menu supérieure */
        .top-bar {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            padding: 12px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .back-btn {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 15px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }

        .back-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
        }

        .system-time {
            color: white;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .system-time span {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Conteneur principal style desktop */
        .desktop-container {
            display: grid;
            grid-template-columns: 350px 1fr 350px;
            gap: 25px;
            padding: 30px;
            max-width: 1600px;
            margin: 0 auto;
            min-height: calc(100vh - 60px);
        }

        /* Panneau gauche - Horloge */
        .left-panel {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .clock-widget {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px 30px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        .digital-clock {
            font-size: 4em;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 15px;
            letter-spacing: 2px;
            font-variant-numeric: tabular-nums;
        }

        .current-date {
            font-size: 1.1em;
            color: #555;
            margin-bottom: 8px;
        }

        .year-display {
            font-size: 0.95em;
            color: #888;
        }

        /* Panneau central - Météo principale */
        .center-panel {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .main-weather {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 25px;
            padding: 50px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            color: white;
            text-align: center;
            flex: 1;
        }

        .weather-icon-large {
            font-size: 120px;
            margin-bottom: 20px;
            filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
        }

        .temperature-display {
            font-size: 5.5em;
            font-weight: 700;
            margin: 20px 0;
            text-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .weather-description {
            font-size: 1.8em;
            margin-bottom: 15px;
            opacity: 0.95;
        }

        .location-display {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 30px;
        }

        .weather-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 2px solid rgba(255, 255, 255, 0.3);
        }

        .stat-box {
            text-align: center;
        }

        .stat-label {
            font-size: 0.95em;
            opacity: 0.85;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 2em;
            font-weight: 700;
        }

        /* Panneau droit - Prévisions */
        .right-panel {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
            max-height: calc(100vh - 120px);
        }

        .forecast-title {
            font-size: 1.5em;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
        }

        .forecast-items {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .forecast-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 18px;
            transition: all 0.3s;
            cursor: pointer;
            border: 2px solid transparent;
        }

        .forecast-card:hover {
            background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
            transform: translateX(5px);
            border-color: #667eea;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
        }

        .forecast-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .forecast-day-name {
            font-weight: 700;
            color: #2c3e50;
            font-size: 1.1em;
        }

        .forecast-icon-small {
            font-size: 2em;
        }

        .forecast-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .forecast-date-text {
            font-size: 0.85em;
            color: #7f8c8d;
        }

        .forecast-temps {
            font-size: 1.2em;
            font-weight: 700;
            color: #667eea;
        }

        /* Responsive design */
        @media (max-width: 1200px) {
            .desktop-container {
                grid-template-columns: 1fr;
                grid-template-rows: auto auto auto;
            }

            .right-panel {
                max-height: 500px;
            }
        }

        /* Scrollbar personnalisée */
        .right-panel::-webkit-scrollbar {
            width: 8px;
        }

        .right-panel::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        .right-panel::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 10px;
        }

        .loading-text {
            text-align: center;
            padding: 30px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <!-- Barre supérieure -->
    <div class="top-bar">
        <a href="index.php" class="back-btn">
            ← Hiverina
        </a>
        <div class="system-time">
            <span id="top-time"></span>
        </div>
    </div>

    <!-- Conteneur principal -->
    <div class="desktop-container">
        
        <!-- Panneau gauche - Horloge -->
        <div class="left-panel">
            <div class="clock-widget">
                <div class="digital-clock" id="main-clock">--:--:--</div>
                <div class="current-date" id="date-display">Mampiseho...</div>
                <div class="year-display" id="year-display">----</div>
            </div>
        </div>

        <!-- Panneau central - Météo principale -->
        <div class="center-panel">
            <div class="main-weather" id="main-weather">
                <div class="loading-text">Mampiseho toetr'andro...</div>
            </div>
        </div>

        <!-- Panneau droit - Prévisions 7 jours -->
        <div class="right-panel">
            <div class="forecast-title">
                📅 Vinavina 7 andro
            </div>
            <div class="forecast-items" id="forecast-container"></div>
        </div>

    </div>

    <script>
        // Noms des jours et mois en malgache
        const jours = ["Alahady", "Alatsinainy", "Talata", "Alarobia", "Alakamisy", "Zoma", "Asabotsy"];
        const mois = ["Janoary", "Febroary", "Martsa", "Aprily", "Mey", "Jona", "Jolay", "Aogositra", "Septambra", "Oktobra", "Novambra", "Desambra"];

        // Mise à jour de l'heure
        function updateTime() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');

            const timeStr = `${h}:${m}:${s}`;
            document.getElementById('main-clock').textContent = timeStr;
            document.getElementById('top-time').textContent = timeStr;

            const dateStr = `${jours[now.getDay()]}, ${now.getDate()} ${mois[now.getMonth()]}`;
            document.getElementById('date-display').textContent = dateStr;
            document.getElementById('year-display').textContent = now.getFullYear();
        }

        // Icônes météo
        function getWeatherIcon(description) {
            const desc = description.toLowerCase();
            if (desc.includes('orana') || desc.includes('pluie')) return '🌧️';
            if (desc.includes('rahona') || desc.includes('nuage')) return '☁️';
            if (desc.includes('kotroka') || desc.includes('orage')) return '⛈️';
            if (desc.includes('rivotra') || desc.includes('vent')) return '💨';
            if (desc.includes('mangatsiaka') || desc.includes('froid')) return '❄️';
            if (desc.includes('mafana') || desc.includes('chaud')) return '🔥';
            return '☀️';
        }

        // Générer la météo du jour
        function generateTodayWeather() {
            const descriptions = [
                "Mangiran-dratsy tsara",
                "Misy rahona kely",
                "Misy orana mitsitsy",
                "Mahery ny rivotra",
                "Mafana be ny andro",
                "Mangatsiaka be",
                "Misy kotroka lavitra",
                "Mitsiditsidina ny masoandro"
            ];

            const tempMax = Math.floor(Math.random() * 18) + 18;
            const tempMin = tempMax - Math.floor(Math.random() * 8) - 5;
            const humidity = Math.floor(Math.random() * 60) + 20;
            const precipitation = Math.floor(Math.random() * 50);
            const wind = Math.floor(Math.random() * 25) + 5;
            const description = descriptions[Math.floor(Math.random() * descriptions.length)];

            const html = `
                <div class="weather-icon-large">${getWeatherIcon(description)}</div>
                <div class="temperature-display">${tempMax}°C</div>
                <div class="weather-description">${description}</div>
                <div class="location-display"> Antananarivo, Madagasikara</div>
                <div class="weather-stats">
                    <div class="stat-box">
                        <div class="stat-label">Min</div>
                        <div class="stat-value">${tempMin}°</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Max</div>
                        <div class="stat-value">${tempMax}°</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label"> Orana</div>
                        <div class="stat-value">${precipitation}mm</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label"> Rivotra</div>
                        <div class="stat-value">${wind}km/h</div>
                    </div>
                </div>
            `;

            document.getElementById('main-weather').innerHTML = html;
        }

        // Générer les prévisions 7 jours
        function generateForecast() {
            const descriptions = [
                "Mangiran-dratsy",
                "Misy rahona",
                "Misy orana",
                "Mahery rivotra",
                "Mafana be",
                "Mangatsiaka",
                "Misy kotroka"
            ];

            let forecastHTML = '';
            const now = new Date();

            for (let i = 1; i <= 7; i++) {
                const futureDate = new Date(now);
                futureDate.setDate(now.getDate() + i);

                const dayName = jours[futureDate.getDay()];
                const dateStr = `${futureDate.getDate()} ${mois[futureDate.getMonth()]}`;
                
                const tempMax = Math.floor(Math.random() * 18) + 18;
                const tempMin = tempMax - Math.floor(Math.random() * 8) - 5;
                const description = descriptions[Math.floor(Math.random() * descriptions.length)];

                forecastHTML += `
                    <div class="forecast-card">
                        <div class="forecast-header">
                            <div class="forecast-day-name">${dayName}</div>
                            <div class="forecast-icon-small">${getWeatherIcon(description)}</div>
                        </div>
                        <div class="forecast-details">
                            <div class="forecast-date-text">${dateStr}</div>
                            <div class="forecast-temps">${tempMin}° / ${tempMax}°</div>
                        </div>
                    </div>
                `;
            }

            document.getElementById('forecast-container').innerHTML = forecastHTML;
        }

        // Initialisation
        updateTime();
        setInterval(updateTime, 1000);

        generateTodayWeather();
        generateForecast();

        // Mise à jour périodique de la météo (toutes les 10 minutes)
        setInterval(() => {
            generateTodayWeather();
            generateForecast();
        }, 600000);
    </script>
</body>
</html>