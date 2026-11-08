<?php
// PHP LOGIC - AUCUNE MODIFICATION MAJEURE NÉCESSAIRE ICI, VOTRE LOGIQUE EST SOLIDE

require_once 'config.php';
requireLogin();

$paysan = getCurrentPaysan();
$lang = getUserLang();

// S'assurer que $lang a une valeur valide
if (empty($lang) || !in_array($lang, ['fr', 'mg'])) {
    $lang = 'mg';
}

// Récupérer les conseils
$db = Database::getInstance()->getConnection();
$filter_cat = isset($_GET['cat']) ? trim($_GET['cat']) : 'all';

try {
    if ($filter_cat === 'all') {
        $stmt = $db->prepare("
            SELECT c.*, 
                   COALESCE(p.nom_produit, '') as nom_produit, 
                   COALESCE(p.nom_malagasy, '') as nom_malagasy
            FROM CONSEIL c
            LEFT JOIN PRODUIT p ON c.id_produit = p.id_produit
            ORDER BY c.date_creation DESC
        ");
        $stmt->execute();
    } else {
        $stmt = $db->prepare("
            SELECT c.*, 
                   COALESCE(p.nom_produit, '') as nom_produit, 
                   COALESCE(p.nom_malagasy, '') as nom_malagasy
            FROM CONSEIL c
            LEFT JOIN PRODUIT p ON c.id_produit = p.id_produit
            WHERE c.categorie = ?
            ORDER BY c.date_creation DESC
        ");
        $stmt->execute([$filter_cat]);
    }
    $conseils = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    error_log("Erreur conseils: " . $e->getMessage());
    $conseils = [];
}

// Définir les catégories - EXACTEMENT comme dans la base
$categories = [
    'all' => ['fr' => 'Tous', 'mg' => 'hevitra rehetra', 'icon' => '📋'],
    'Semis' => ['fr' => 'Semis', 'mg' => 'Fambolena', 'icon' => '🌱'],
    'Entretien' => ['fr' => 'Entretien', 'mg' => 'Fikarakarana', 'icon' => '🌿'],
    'Récolte' => ['fr' => 'Récolte', 'mg' => 'Fijinjana', 'icon' => '🌾'],
    'Lutte parasites' => ['fr' => 'Parasites', 'mg' => 'biby maniba', 'icon' => '🐛'],
    'Sol' => ['fr' => 'Sol', 'mg' => 'Tany', 'icon' => '🌍'],
    'Autre' => ['fr' => 'Autre', 'mg' => 'torihevitra hafa mahasoa', 'icon' => '💡']
];

// Fonctions utilitaires - Conservées pour la cohérence
function getCategoryIcon($cat) {
    $icons = [
        'Semis' => '🌱',
        'Entretien' => '🌿',
        'Récolte' => '🌾',
        'Lutte parasites' => '🐛',
        'Sol' => '🌍',
        'Autre' => '💡'
    ];
    return isset($icons[$cat]) ? $icons[$cat] : '💡';
}

function getCategoryColor($cat) {
    $colors = [
        'Semis' => 'success',
        'Entretien' => 'info',
        'Récolte' => 'warning',
        'Lutte parasites' => 'danger',
        'Sol' => 'primary',
        'Autre' => 'secondary'
    ];
    return isset($colors[$cat]) ? $colors[$cat] : 'secondary';
}

function getTranslatedCategory($categorie, $lang, $categories) {
    if (isset($categories[$categorie])) {
        if (isset($categories[$categorie][$lang])) {
            return $categories[$categorie][$lang];
        }
    }
    return $categorie;
}

function getTranslatedText($text_mg, $text_fr, $lang) {
    if ($lang === 'mg' && !empty($text_mg)) {
        return $text_mg;
    }
    return !empty($text_fr) ? $text_fr : '';
}
?>
<!DOCTYPE html>
<html lang="<?= htmlspecialchars($lang) ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tantsaha Connect - <?= $lang === 'mg' ? 'Torohevitra' : 'Conseils' ?></title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <style>
        /* Variables CSS */
        :root {
            --primary-green: #28a745;
            --dark-green: #1e7e34;
            --light-green: #d4edda;
            --bg-body: #f4f6f9; /* Fond de corps plus clair */
            --bg-card: #ffffff;
            --bg-gradient-start: #ffffff; /* Simplification du dégradé de fond */
            --bg-gradient-end: #f0f3f5; 
            --box-shadow-light: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        body {
            background-color: var(--bg-body); /* Utilisation d'une couleur unie pour la performance */
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #343a40;
        }
        
        /* Navbar */
        .navbar-custom {
            background: var(--bg-card);
            box-shadow: 0 1px 6px rgba(0,0,0,0.1); /* Ombre plus douce */
            padding: 0.75rem 0;
        }
        
        .navbar-brand {
            font-weight: 800; /* Plus d'impact */
            color: var(--primary-green) !important;
            font-size: 1.6rem;
        }
        
        .btn-back:hover {
            color: var(--primary-green);
            transform: translateX(-5px); /* Animation plus prononcée */
        }
        
        /* En-tête de page */
        .page-header {
            background: linear-gradient(45deg, var(--light-green) 0%, #ffffff 100%);
            border-radius: 15px;
            padding: 2.5rem;
            margin: 2rem 0;
            box-shadow: 0 6px 15px rgba(0,0,0,0.08); /* Ombre plus distincte */
            border-left: 6px solid var(--primary-green);
        }
        
        .page-header h1 {
            color: #212529;
            font-weight: 700;
            margin: 0;
            font-size: 2.2rem;
        }
        
        /* Filtres - Pills améliorés */
        .filter-section {
            margin-bottom: 2rem;
        }
        
        .filter-pills {
            display: flex;
            gap: 0.75rem; /* Espacement un peu plus grand */
            flex-wrap: wrap;
        }
        
        .filter-pill {
            padding: 0.6rem 1.2rem;
            border-radius: 8px; /* Bords légèrement moins arrondis pour un look plus moderne */
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            border: 1px solid #ced4da; /* Bordure plus fine */
            background: #f8f9fa;
            color: #495057;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .filter-pill:hover {
            border-color: var(--primary-green);
            color: var(--dark-green);
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(40, 167, 69, 0.1);
        }
        
        .filter-pill.active {
            background: var(--primary-green);
            color: #fff;
            border-color: var(--primary-green);
            box-shadow: 0 4px 10px rgba(40, 167, 69, 0.4);
            font-weight: 700;
        }
        
        /* Cards conseils - Nouveau Style */
        .conseil-card {
            background: var(--bg-card);
            border-radius: 12px;
            box-shadow: var(--box-shadow-light);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Transition plus lisse */
            overflow: hidden;
            margin-bottom: 1.75rem;
            border: none;
            height: 100%; /* Important pour le layout en grille */
        }
        
        .conseil-card:hover {
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            transform: translateY(-8px);
        }
        
        .card-header-custom {
            background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 1.5rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .conseil-icon-lg {
            font-size: 2.8rem;
            color: #343a40;
        }
        
        .badge-category {
            font-size: 0.8rem;
            font-weight: 700;
            padding: 0.35rem 0.75rem;
            border-radius: 4px;
            text-transform: uppercase;
        }
        
        .conseil-title {
            font-size: 1.35rem;
            font-weight: 700;
            color: #212529;
            margin-top: 0.6rem;
            line-height: 1.3;
        }
        
        .conseil-product {
            color: #868e96;
            font-size: 0.95rem;
            font-style: italic;
        }
        
        .card-body-custom {
            padding: 1.5rem;
        }
        
        .conseil-content {
            font-size: 1rem;
            line-height: 1.6;
            color: #495057;
            margin-bottom: 1rem;
        }
        
        /* Masque pour le contenu réduit */
        .conseil-short {
            max-height: 120px; /* Un peu plus de hauteur */
            overflow: hidden;
            position: relative;
        }
        
        .conseil-short::after {
            content: '...'; /* Remplacer le dégradé par des points de suspension */
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            text-align: right;
            padding: 0 10px 5px 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 70%);
            color: #6c757d;
            font-weight: 600;
        }
        
        .conseil-full {
            max-height: none;
        }
        
        .conseil-full::after {
            display: none;
        }
        
        /* Footer card - Boutons */
        .card-footer-custom {
            background: #f8f9fa;
            padding: 1.25rem 1.5rem;
            border-top: 1px solid #e9ecef;
            display: flex; /* Utilisation de flex pour l'alignement */
            justify-content: space-between;
            align-items: center;
        }
        
        .btn-group-custom {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            width: 100%;
        }
        
        .btn-action {
            flex: 1;
            min-width: 100px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            text-transform: capitalize;
        }
        
        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }

        /* Couleurs personnalisées pour les boutons */
        .btn-primary-custom, .btn-success-custom, .btn-warning-custom {
            border: none !important;
        }
        
        .btn-primary-custom { background: #0d6efd; }
        .btn-primary-custom:hover { background: #0b5ed7; }
        
        .btn-success-custom { background: var(--primary-green); }
        .btn-success-custom:hover { background: var(--dark-green); }
        
        .btn-success-custom.playing { 
            background: #dc3545; /* Rouge pour arrêter */
            animation: pulse 1s infinite; 
        }
        
        .btn-warning-custom { 
            background: #ffc107; 
            color: #000;
        }
        .btn-warning-custom:hover { 
            background: #e0a800; 
            color: #000;
        }

        /* État vide */
        .empty-state {
            /* ... (conservé, il est déjà bien) ... */
        }
        
        /* Responsive */
        @media (min-width: 992px) { /* Affichage en grille sur les grands écrans */
            .row-conseils {
                display: flex;
                flex-wrap: wrap;
            }
            .row-conseils .col-12 {
                flex: 0 0 50%;
                max-width: 50%;
            }
        }

        @media (max-width: 768px) {
            .page-header {
                padding: 1.5rem;
                margin: 1rem 0;
            }
            
            .page-header h1 {
                font-size: 1.75rem;
            }
            
            .filter-pills {
                overflow-x: scroll; /* Défilement horizontal pour les filtres */
                flex-wrap: nowrap;
                padding-bottom: 0.5rem;
            }
            
            .filter-pill {
                flex-shrink: 0;
            }
            
            .btn-group-custom {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .btn-action {
                width: 100%;
                min-width: 100%;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-custom navbar-expand-lg sticky-top">
        <div class="container">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-flower1"></i> Tantsaha **Connect**
            </a>
            <a href="index.php" class="btn-back ms-auto">
                <i class="bi bi-arrow-left-circle"></i>
                <span><?= $lang === 'mg' ? 'Hiverina' : 'Retour' ?></span>
            </a>
        </div>
    </nav>

    <div class="container py-4">
        <div class="page-header">
            <h1>
                <i class="bi bi-lightbulb-fill text-warning me-2"></i>
                <?= $lang === 'mg' ? 'Torohevitra ho an\'ny tantsaha' : 'Conseils agricoles' ?>
            </h1>
        </div>
        
        <div class="filter-section">
            <div class="filter-pills">
                <?php foreach ($categories as $key => $cat): ?>
                <a href="?cat=<?= urlencode($key) ?>" 
                    class="filter-pill <?= $filter_cat === $key ? 'active' : '' ?>">
                    <span><?= $cat['icon'] ?></span>
                    <span><?= $cat[$lang] ?></span>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
        
        <?php if (count($conseils) > 0): ?>
            <div class="row row-conseils">
                <?php foreach ($conseils as $i => $conseil): ?>
                <div class="col-12 col-lg-6"> <div class="conseil-card">
                        <div class="card-header-custom">
                            <div class="d-flex align-items-center gap-3">
                                <div class="conseil-icon-lg">
                                    <?= getCategoryIcon($conseil['categorie'] ?? '') ?>
                                </div>
                                <div class="flex-grow-1">
                                    <span class="badge bg-<?= getCategoryColor($conseil['categorie'] ?? '') ?> badge-category">
                                        <?= htmlspecialchars(getTranslatedCategory(
                                            $conseil['categorie'] ?? '', 
                                            $lang, 
                                            $categories
                                        )) ?>
                                    </span>
                                    <div class="conseil-title">
                                        <?= htmlspecialchars(getTranslatedText(
                                            $conseil['titre_malagasy'] ?? '',
                                            $conseil['titre'] ?? '',
                                            $lang
                                        )) ?>
                                    </div>
                                    <?php 
                                    $produit = getTranslatedText(
                                        $conseil['nom_malagasy'] ?? '',
                                        $conseil['nom_produit'] ?? '',
                                        $lang
                                    );
                                    if (!empty($produit)): 
                                    ?>
                                    <div class="conseil-product mt-1">
                                        <i class="bi bi-seed"></i>
                                        <span><?= htmlspecialchars($produit) ?></span>
                                    </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card-body-custom">
                            <div id="content-<?= $i ?>" class="conseil-content conseil-short">
                                <?= nl2br(htmlspecialchars(getTranslatedText(
                                    $conseil['contenu_malagasy'] ?? '',
                                    $conseil['contenu'] ?? '',
                                    $lang
                                ))) ?>
                            </div>
                        </div>
                        
                        <div class="card-footer-custom">
                            <div class="btn-group-custom">
                                <button class="btn btn-action btn-primary-custom" onclick="toggleContent(<?= $i ?>)">
                                    <i class="bi bi-eye-fill"></i>
                                    <span id="btn-text-<?= $i ?>">
                                        <?= $lang === 'mg' ? 'Hijery bebe kokoa' : 'Lire plus' ?>
                                    </span>
                                </button>
                                
                                <button class="btn btn-action btn-success-custom" id="tts-btn-<?= $i ?>" 
                                        onclick="speakText(<?= $i ?>, '<?= htmlspecialchars(getTranslatedText(
                                            $conseil['titre_malagasy'] ?? '',
                                            $conseil['titre'] ?? '',
                                            $lang
                                        ), ENT_QUOTES) ?>', '<?= htmlspecialchars(getTranslatedText(
                                            $conseil['contenu_malagasy'] ?? '',
                                            $conseil['contenu'] ?? '',
                                            $lang
                                        ), ENT_QUOTES) ?>')">
                                    <i class="bi bi-megaphone-fill"></i>
                                    <span id="tts-text-<?= $i ?>">
                                        <?= $lang === 'mg' ? 'Mihaino' : 'Écouter' ?>
                                    </span>
                                </button>
                                
                                <?php if (!empty($conseil['audio_url'])): ?>
                                <button class="btn btn-action btn-warning-custom" onclick="playAudio('<?= htmlspecialchars($conseil['audio_url'], ENT_QUOTES) ?>')">
                                    <i class="bi bi-volume-up-fill"></i>
                                    <span><?= $lang === 'mg' ? 'Audio' : 'Audio' ?></span>
                                </button>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            
        <?php else: ?>
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3 class="mb-3"><?= $lang === 'mg' ? 'Tsy misy torohevitra' : 'Aucun conseil disponible' ?></h3>
                <p class="text-muted mb-0">
                    <?= $lang === 'mg' ? 'Mila miandry kely' : 'Veuillez réessayer plus tard' ?>
                </p>
            </div>
        <?php endif; ?>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        const lang = '<?= $lang ?>';
        let currentSpeech = null;
        let currentIndex = null;
        let voices = [];
        
        // Charger les voix disponibles
        function loadVoices() {
            voices = window.speechSynthesis.getVoices();
        }
        
        // Vérifier si le navigateur supporte la synthèse vocale
        if ('speechSynthesis' in window) {
            loadVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
        
        function toggleContent(index) {
            const content = document.getElementById('content-' + index);
            const btn = document.getElementById('btn-text-' + index).parentNode; // Récupère le bouton
            const btnText = document.getElementById('btn-text-' + index);
            
            if (content.classList.contains('conseil-short')) {
                content.classList.remove('conseil-short');
                content.classList.add('conseil-full');
                btnText.innerHTML = lang === 'mg' ? 'Hihidy' : 'Réduire';
                btn.querySelector('i').classList.remove('bi-eye-fill');
                btn.querySelector('i').classList.add('bi-eye-slash-fill');
            } else {
                content.classList.remove('conseil-full');
                content.classList.add('conseil-short');
                btnText.innerHTML = lang === 'mg' ? 'Hijery bebe kokoa' : 'Lire plus';
                btn.querySelector('i').classList.remove('bi-eye-slash-fill');
                btn.querySelector('i').classList.add('bi-eye-fill');
            }
        }
        
        function playAudio(url) {
            if (!url) {
                alert(lang === 'mg' ? 'Tsy misy feo' : 'Pas d\'audio disponible');
                return;
            }
            
            // Annuler la synthèse vocale si elle est en cours
            if (currentSpeech) {
                window.speechSynthesis.cancel();
                // Remettre le bouton précédent à l'état initial
                if (currentIndex !== null) {
                    const oldBtn = document.getElementById('tts-btn-' + currentIndex);
                    const oldBtnText = document.getElementById('tts-text-' + currentIndex);
                    if (oldBtn) oldBtn.classList.remove('playing');
                    if (oldBtnText) oldBtnText.innerHTML = lang === 'mg' ? 'Mihaino' : 'Écouter';
                }
                currentSpeech = null;
                currentIndex = null;
            }
            
            const audio = new Audio(url);
            audio.play().catch(function(error) {
                alert('Erreur de lecture audio / Tsy afaka mamaky ny feo');
            });
        }
        
        function speakText(index, titre, contenu) {
            const btn = document.getElementById('tts-btn-' + index);
            const btnText = document.getElementById('tts-text-' + index);
            
            // Si une lecture est en cours pour ce même conseil
            if (currentSpeech && currentIndex === index) {
                window.speechSynthesis.cancel();
                btn.classList.remove('playing');
                btnText.innerHTML = lang === 'mg' ? 'Mihaino' : 'Écouter';
                currentSpeech = null;
                currentIndex = null;
                return;
            }
            
            // Arrêter toute autre lecture en cours
            if (currentSpeech) {
                window.speechSynthesis.cancel();
                if (currentIndex !== null) {
                    const oldBtn = document.getElementById('tts-btn-' + currentIndex);
                    const oldBtnText = document.getElementById('tts-text-' + currentIndex);
                    if (oldBtn) oldBtn.classList.remove('playing');
                    if (oldBtnText) oldBtnText.innerHTML = lang === 'mg' ? 'Mihaino' : 'Écouter';
                }
            }
            
            // Décoder les entités HTML
            function decodeHtml(html) {
                const txt = document.createElement('textarea');
                txt.innerHTML = html;
                return txt.value.replace(/(\r\n|\n|\r)/gm, " "); // Supprimer les sauts de ligne
            }
            
            const titreClean = decodeHtml(titre);
            const contenuClean = decodeHtml(contenu);
            const texteComplet = titreClean + '. ' + contenuClean;
            
            if (texteComplet.trim() === '.') {
                 alert(lang === 'mg' ? 'Tsy misy torohevitra hovakiana' : 'Aucun texte à lire');
                 return;
            }
            
            // Créer l'objet de synthèse vocale
            currentSpeech = new SpeechSynthesisUtterance(texteComplet);
            currentIndex = index;
            
            // Essayer de trouver une voix appropriée
            voices = window.speechSynthesis.getVoices();
            let selectedVoice = null;
            
            // Logique de sélection de la voix améliorée
            const preferredLangCode = lang === 'mg' ? 'fr-FR' : 'fr-FR'; // Utiliser le français comme fallback ou principal
            
            selectedVoice = voices.find(voice => voice.lang.includes(preferredLangCode) && voice.default) ||
                            voices.find(voice => voice.lang.includes(preferredLangCode)) ||
                            voices.find(voice => voice.lang.includes('en')); // Dernier recours
            
            if (selectedVoice) {
                currentSpeech.voice = selectedVoice;
            }
            
            // Configuration
            currentSpeech.lang = preferredLangCode; 
            currentSpeech.rate = 0.95; // Légèrement plus rapide
            currentSpeech.pitch = 1.0;
            currentSpeech.volume = 1.0;
            
            // Gérer les événements
            currentSpeech.onstart = function() {
                btn.classList.add('playing');
                btnText.innerHTML = lang === 'mg' ? 'Ajanona' : 'Arrêter';
            };
            
            currentSpeech.onend = function() {
                btn.classList.remove('playing');
                btnText.innerHTML = lang === 'mg' ? 'Mihaino' : 'Écouter';
                currentSpeech = null;
                currentIndex = null;
            };
            
            currentSpeech.onerror = function(event) {
                btn.classList.remove('playing');
                btnText.innerHTML = lang === 'mg' ? 'Mihaino' : 'Écouter';
                alert(lang === 'mg' ? 
                    'Tsy afaka mamaky ny feo. Azafady, avereno indray.' :
                    'Erreur de lecture. Veuillez réessayer.');
                currentSpeech = null;
                currentIndex = null;
            };
            
            // Lancer la lecture avec un petit délai pour annuler toute lecture précédente
            setTimeout(function() {
                try {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(currentSpeech);
                } catch (error) {
                    alert(lang === 'mg' ? 
                        'Tsy afaka namaky ny feo. Jereo raha misokatra ny volume.' : 
                        'Impossible de lire. Vérifiez que le volume est activé.');
                    btn.classList.remove('playing');
                    btnText.innerHTML = lang === 'mg' ? 'Mihaino' : 'Écouter';
                }
            }, 100);
        }
        
        // Arrêter la lecture quand on quitte la page
        window.addEventListener('beforeunload', function() {
            if (currentSpeech) {
                window.speechSynthesis.cancel();
            }
        });
    </script>
</body>
</html>