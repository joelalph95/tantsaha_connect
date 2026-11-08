<?php
require_once 'config.php';
requireLogin();

$paysan = getCurrentPaysan();
$lang = getUserLang();

// Récupérer les alertes non lues
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("SELECT COUNT(*) as count FROM ALERTE WHERE id_paysan = ? AND lu = 0");
$stmt->execute([$_SESSION['paysan_id']]);
$alertes_count = $stmt->fetch()['count'];

// Récupérer la météo du jour
$stmt = $db->prepare("
    SELECT m.*, l.nom_localite 
    FROM METEO m 
    JOIN LOCALISATION l ON m.id_localisation = l.id_localisation
    WHERE DATE(m.date_prevision) = CURDATE()
    LIMIT 1
");
$stmt->execute();
$meteo_today = $stmt->fetch();

// Définir les icônes en fonction de la description (exemple simple)
function getMeteoIcon($description) {
    if (stripos($description, 'pluie') !== false || stripos($description, 'orages') !== false) {
        return '🌧️';
    } elseif (stripos($description, 'nuageux') !== false) {
        return '☁️';
    } elseif (stripos($description, 'soleil') !== false || stripos($description, 'clair') !== false) {
        return '☀️';
    }
    return '🌡️';
}
$meteo_icon = getMeteoIcon($meteo_today['description_temps'] ?? '');
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tantsaha Connect - <?= t('welcome', $lang) ?></title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    
    <style>
        :root {
            --primary-color: #5fa463; /* Couleur verte Tantsaha */
            --primary-dark: #3e7c41;
            --danger-color: #c0392b;
            --transition-speed: 0.3s;
            --bs-body-bg: #f4f9f4;
            --bs-body-color: #212529;
        }

        /* Variables Dark Mode */
        body.dark-mode {
            --bs-body-bg: #1a1a1a;
            --bs-body-color: #e0e0e0;
            --bs-card-bg: #2d2d2d;
            --bs-bg-light: #2d2d2d;
            --bs-border-color: #444;
            color: var(--bs-body-color) !important;
        }

        body {
            transition: background-color var(--transition-speed), color var(--transition-speed);
        }

        /* Header avec dégradé Bootstrap */
        .header-gradient {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        }

        /* Cards personnalisées avec classes Bootstrap */
        .card {
            transition: transform var(--transition-speed), box-shadow var(--transition-speed), background-color var(--transition-speed), color var(--transition-speed);
            border: 1px solid var(--bs-border-color, #dee2e6) !important; /* Ajout d'une bordure par défaut */
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
        }

        /* Menu items avec Bootstrap */
        .menu-item {
            transition: all var(--transition-speed);
            min-height: 140px;
            background-color: var(--bs-card-bg);
            color: var(--bs-body-color) !important;
        }

        .menu-item:hover {
            transform: translateY(-8px);
            background: linear-gradient(135deg, #eaf8ea, #d4f1d4) !important;
            box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.2) !important;
            color: #212529 !important;
        }

        body.dark-mode .menu-item:hover {
             background: linear-gradient(135deg, #3e7c41, #4a9450) !important; /* Dégradé pour le dark mode hover */
             color: #ffffff !important;
        }

        .menu-icon {
            font-size: 2.5rem;
        }

        /* Stats avec animation */
        .stat-card {
            transition: all var(--transition-speed);
        }

        .stat-card:hover {
            transform: scale(1.05);
        }

        /* Bouton Dark Mode */
        .dark-mode-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            z-index: 1050;
        }

        /* Loading Spinner */
        .spinner-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }

        .spinner-overlay.active {
            display: flex;
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
            animation: fadeInUp 0.6s ease-out;
        }

        /* Toast personnalisé */
        .toast-container {
            z-index: 1060;
        }
    </style>
</head>
<body class="bg-body-tertiary">
    <div class="spinner-overlay align-items-center justify-content-center" id="loadingSpinner">
        <div class="spinner-border text-light" style="width: 4rem; height: 4rem;" role="status">
            <span class="visually-hidden">Chargement...</span>
        </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastContainer"></div>

    <nav class="navbar navbar-expand-lg header-gradient shadow-sm mb-4">
        <div class="container-fluid mx-auto" style="max-width: 1400px;">
            <a class="navbar-brand text-white d-flex align-items-center gap-2" href="#">
                <span class="fs-2">🌾</span>
                <span class="h3 mb-0">Tantsaha Connect</span>
            </a>
            <div class="d-flex align-items-center text-white fs-5">
                <i class="bi bi-person-circle me-2"></i>
                <span id="welcomeText">
                    <?= $lang === 'mg' ? 'bienvenue, ' : 'tonga soa , '?>
                </span>
                <strong><?= htmlspecialchars($paysan['prenom']) ?></strong>
            </div>
        </div>
    </nav>
    
    <div class="container-fluid py-2">
        <div class="mx-auto" style="max-width: 1400px;">
            
            <div class="row g-4">
                
                <div class="col-lg-4">
                    <div class="sticky-lg-top" style="top: 80px;"> <div class="card shadow-sm mb-4 animate-fade-in" id="meteoCard">
                            <div class="card-body text-center p-4 border-start border-primary border-5 rounded-end-1">
                                <h5 class="card-title text-primary mb-3">
                                    <i class="bi bi-cloud-sun me-2"></i>Météo du jour
                                </h5>
                                <div class="mb-3" style="font-size: 3rem;">
                                    <span id="meteoIcon"><?= $meteo_icon ?></span>
                                </div>
                                <div class="display-4 fw-bold text-primary mb-2" id="meteoTemp">
                                    <?= $meteo_today ? round($meteo_today['temperature_max']) : '--' ?>°C
                                </div>
                                <div class="fs-5 mb-3 text-muted" id="meteoDesc">
                                    <?= htmlspecialchars($meteo_today['description_temps'] ?? 'Miandry....') ?>
                                </div>
                                <div class="text-secondary small">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span id="meteoLoc"><?= htmlspecialchars($meteo_today['nom_localite'] ?? '') ?></span>
                                </div>
                                <button class="btn btn-outline-primary btn-sm mt-3" onclick="refreshMeteo()">
                                    <i class="bi bi-arrow-clockwise"></i> Havaozina
                                </button>
                            </div>
                        </div>

                        <div class="d-none d-lg-block animate-fade-in" style="animation-delay: 0.2s;">
                            <div class="card shadow-sm">
                                <div class="card-body p-4">
                                    <h5 class="card-title text-primary border-bottom border-primary border-3 pb-3 mb-4">
                                        <i class="bi bi-speedometer2 me-2"></i>Topi-maso haingana
                                    </h5>
                                    
                                    <div class="card border-0 mb-3 stat-card bg-light">
                                        <div class="card-body text-center border-start border-primary border-4 rounded-end-1">
                                            <div class="display-5 fw-bold text-primary" id="alertesCount">
                                                <?= $alertes_count ?>
                                            </div>
                                            <small class="text-muted">
                                                <i class="bi bi-bell-fill"></i> Fampitandremana tsy mbola novakiana
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <div class="card border-0 stat-card bg-light">
                                        <div class="card-body text-center border-start border-warning border-4 rounded-end-1">
                                            <div class="display-5 fw-bold text-warning" id="tempMax">
                                                <?= $meteo_today ? round($meteo_today['temperature_max']) : '--' ?>°
                                            </div>
                                            <small class="text-muted">
                                                <i class="bi bi-thermometer-half"></i> Mari-pana ambony indrindra
                                            </small>
                                        </div>
                                    </div>

                                    <div class="alert alert-info mt-4 mb-0 text-center shadow-sm">
                                        <small>
                                            <i class="bi bi-calendar-event me-1"></i>
                                            <span id="currentDate"><?= date('d/m/Y') ?></span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8">
                    
                    <div class="card shadow-sm mb-4 animate-fade-in" style="animation-delay: 0.1s;">
                        <div class="card-body p-4">
                            <h5 class="card-title text-primary border-bottom border-primary border-3 pb-3 mb-4">
                                <i class="bi bi-grid-3x3-gap-fill me-2"></i>tare marika
                            </h5>
                            
                            <div class="row g-3">
                                <div class="col-6 col-md-4">
                                    <a href="meteo.php" class="card shadow-sm text-decoration-none menu-item d-flex flex-column align-items-center justify-content-center p-4 h-100 rounded-3">
                                        <span class="menu-icon mb-2">🌤️</span>
                                        <div class="fw-semibold text-center">
                                            <?= $lang === 'mg' ? 'Toetr\'andro' : 'Toetr andro' ?>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-6 col-md-4">
                                    <a href="alertes.php" class="card shadow-sm text-decoration-none menu-item d-flex flex-column align-items-center justify-content-center p-4 h-100 rounded-3 position-relative">
                                        <?php if ($alertes_count > 0): ?>
                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="alertesBadge">
                                            <?= $alertes_count ?>
                                        </span>
                                        <?php endif; ?>
                                        <span class="menu-icon mb-2">🔔</span>
                                        <div class="fw-semibold text-center">
                                            <?= $lang === 'mg' ? 'Alert' : 'Fampitandremana' ?>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-6 col-md-4">
                                    <a href="parcelles.php" class="card shadow-sm text-decoration-none menu-item d-flex flex-column align-items-center justify-content-center p-4 h-100 rounded-3">
                                        <span class="menu-icon mb-2"><i class="bi bi-grid-3x3-gap-fill"></i></span>
                                        <div class="fw-semibold text-center">
                                            <?= $lang === 'mg' ? 'Parcelles' : 'tany' ?>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-6 col-md-4">
                                    <a href="journal.php" class="card shadow-sm text-decoration-none menu-item d-flex flex-column align-items-center justify-content-center p-4 h-100 rounded-3">
                                        <span class="menu-icon mb-2">📝</span>
                                        <div class="fw-semibold text-center">
                                            <?= $lang === 'mg' ? 'Journal' : 'zava baovao' ?>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-6 col-md-4">
                                    <a href="conseils.php" class="card shadow-sm text-decoration-none menu-item d-flex flex-column align-items-center justify-content-center p-4 h-100 rounded-3">
                                        <span class="menu-icon mb-2">💡</span>
                                        <div class="fw-semibold text-center">
                                            <?= $lang === 'mg' ? 'Conseils' : 'Torohevitra' ?>
                                        </div>
                                    </a>
                                </div>

                                <div class="col-6 col-md-4">
                                    <a href="profil.php" class="card shadow-sm text-decoration-none menu-item d-flex flex-column align-items-center justify-content-center p-4 h-100 rounded-3">
                                        <span class="menu-icon mb-2">
                            <i class="bi bi-person-fill"></i>
                        </span>
                                        <div class="fw-semibold text-center">
                                            <?= $lang === 'mg' ? 'Profil ' : 'Mombamomba' ?>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a href="logout.php" class="btn btn-danger btn-lg w-100 shadow-lg mt-3">
                        <i class="bi bi-box-arrow-right me-2"></i>
                        <?= $lang === 'mg' ? 'Déconnexion' : 'Hivoaka' ?>
                    </a>
                </div>
            </div>

        </div>
    </div>

    <button class="btn btn-primary rounded-circle shadow-lg dark-mode-toggle" id="darkModeToggle" title="Basculer le mode sombre">
        <i class="bi bi-moon-stars-fill fs-4" id="darkModeIcon"></i>
    </button>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const darkModeIcon = document.getElementById('darkModeIcon');
        const body = document.body;

        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            darkModeIcon.className = 'bi bi-sun-fill fs-4';
        }

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                darkModeIcon.className = 'bi bi-sun-fill fs-4';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                darkModeIcon.className = 'bi bi-moon-stars-fill fs-4';
                localStorage.setItem('darkMode', 'disabled');
            }
        });

        // Fonction pour afficher un toast
        function showToast(message, type = 'success') {
            const toastHTML = `
                <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;
            
            const container = document.getElementById('toastContainer');
            container.insertAdjacentHTML('beforeend', toastHTML);
            
            const toastElement = container.lastElementChild;
            const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
            toast.show();
            
            toastElement.addEventListener('hidden.bs.toast', () => {
                toastElement.remove();
            });
        }

        // Fonction pour afficher/masquer le spinner
        function showSpinner() {
            document.getElementById('loadingSpinner').classList.add('active');
        }

        function hideSpinner() {
            document.getElementById('loadingSpinner').classList.remove('active');
        }

        // Fonction pour déterminer l'icône météo côté client (à titre d'exemple)
        function getIconForWeather(description) {
            if (description && typeof description === 'string') {
                if (description.toLowerCase().includes('pluie') || description.toLowerCase().includes('orages')) {
                    return '🌧️';
                } else if (description.toLowerCase().includes('nuageux')) {
                    return '☁️';
                } else if (description.toLowerCase().includes('soleil') || description.toLowerCase().includes('clair')) {
                    return '☀️';
                }
            }
            return '🌡️';
        }

        // AJAX - Actualiser la météo
        function refreshMeteo() {
            showSpinner();
            
            fetch('api/get_meteo.php') // Assurez-vous que cette API existe et renvoie les bonnes données
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        const tempMax = Math.round(data.temperature_max);
                        document.getElementById('meteoTemp').textContent = tempMax + '°C';
                        document.getElementById('tempMax').textContent = tempMax + '°';
                        document.getElementById('meteoDesc').textContent = data.description_temps;
                        document.getElementById('meteoLoc').textContent = data.nom_localite;
                        document.getElementById('meteoIcon').textContent = getIconForWeather(data.description_temps);
                        
                        // Réinitialiser l'animation
                        const meteoCard = document.getElementById('meteoCard');
                        meteoCard.classList.remove('animate-fade-in');
                        void meteoCard.offsetWidth; // Trigger reflow
                        meteoCard.classList.add('animate-fade-in');
                        
                        showToast('Météo actualisée avec succès', 'success');
                    } else {
                        showToast(data.message || 'Erreur lors de l\'actualisation de la météo', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    showToast('Erreur de connexion ou de serveur', 'danger');
                })
                .finally(() => {
                    hideSpinner();
                });
        }

        // AJAX - Actualiser le nombre d'alertes
        function refreshAlertes() {
            fetch('api/get_alertes_count.php') // Assurez-vous que cette API existe et renvoie les bonnes données
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        const count = data.count;
                        document.getElementById('alertesCount').textContent = count;
                        
                        const alerteLink = document.querySelector('a[href="alertes.php"]');
                        let badge = document.getElementById('alertesBadge');

                        if (count > 0) {
                            if (badge) {
                                badge.textContent = count;
                            } else {
                                // Créer le badge s'il n'existe pas
                                alerteLink.insertAdjacentHTML('afterbegin', 
                                    `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="alertesBadge">${count}</span>`
                                );
                            }
                        } else if (badge) {
                            badge.remove();
                        }
                    }
                })
                .catch(error => console.error('Erreur lors de l\'actualisation des alertes:', error));
        }

        // Actualiser les alertes toutes les 30 secondes
        setInterval(refreshAlertes, 30000);

        // Mettre à jour la date en temps réel
        function updateDate() {
            const now = new Date();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            // Utiliser le même format que celui défini dans le PHP, ou adapter pour la langue
            document.getElementById('currentDate').textContent = now.toLocaleDateString('fr-FR', options); 
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            updateDate();
            refreshAlertes(); // Lancer une première actualisation
            
            // Animer les cartes au chargement
            const cards = document.querySelectorAll('.animate-fade-in');
            cards.forEach((card, index) => {
                card.style.animationDelay = (index * 0.1) + 's';
            });
        });
    </script>
</body>
</html>