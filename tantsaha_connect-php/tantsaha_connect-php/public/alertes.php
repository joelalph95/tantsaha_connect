<?php
require_once 'config.php';
requireLogin();

$paysan = getCurrentPaysan();
$lang = getUserLang();

// Marquer comme lu
if (isset($_GET['mark_read']) && is_numeric($_GET['mark_read'])) {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("UPDATE ALERTE SET lu = 1 WHERE id_alerte = ? AND id_paysan = ?");
    $stmt->execute([$_GET['mark_read'], $_SESSION['paysan_id']]);
    header('Location: alertes.php?success=marked');
    exit();
}

// Supprimer une alerte
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $id_alerte = (int)$_GET['delete'];
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("DELETE FROM ALERTE WHERE id_alerte = ? AND id_paysan = ?");
    $stmt->execute([$id_alerte, $_SESSION['paysan_id']]);
    header('Location: alertes.php?success=deleted');
    exit();
}

// Récupérer les alertes
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("
    SELECT a.*, s.date_semis, p.nom_produit
    FROM ALERTE a
    LEFT JOIN SAISON s ON a.id_saison = s.id_saison
    LEFT JOIN PRODUIT p ON s.id_produit = p.id_produit
    WHERE a.id_paysan = ?
    ORDER BY a.lu ASC, a.date_alerte DESC, a.priorite DESC
    LIMIT 50
");
$stmt->execute([$_SESSION['paysan_id']]);
$alertes = $stmt->fetchAll(PDO::FETCH_ASSOC);

function getAlertIcon($type) {
    $icons = [
        'Météo' => '🌧️',
        'Semis' => '🌱',
        'Récolte' => '🌾',
        'Parasite' => '🐛',
        'Conseil' => '💡'
    ];
    return $icons[$type] ?? '🔔';
}

function getPriorityColor($priorite) {
    $colors = [
        'Faible' => '#3498db',   // Bleu
        'Moyenne' => '#f39c12',  // Orange
        'Haute' => '#e74c3c'     // Rouge
    ];
    return $colors[$priorite] ?? '#95a5a6';
}

// Helper pour convertir la priorité en classe Bootstrap pour le texte/badge
function getBootstrapClass($priorite) {
    return match($priorite) {
        'Haute' => 'danger',
        'Moyenne' => 'warning',
        'Faible' => 'info',
        default => 'secondary'
    };
}
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tantsaha Connect - <?= $lang === 'mg' ? 'Fampitandremana' : 'Alertes' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: inear-gradient(135deg, var(--primary-color), var(--primary-dark));
            min-height: 100vh;
        }

        /* Header Style Dashboard */
        .page-header {
            background: #3e7c41;
            padding: 1.5rem 0;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        /* Styles des cartes alertes */
        .card-alerte {
            transition: all 0.2s ease-in-out;
            border: 0;
            border-left: 5px solid transparent; /* Réservé pour la couleur de priorité */
        }

        .card-alerte:hover {
            transform: translateY(-3px);
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1)!important;
        }

        /* Style spécifique pour les alertes LUES (grisées) */
        .card-alerte.read {
            background-color: #f8f9fa; /* bg-light */
            opacity: 0.85;
        }
        
        .card-alerte.read .card-title {
            color: #6c757d;
        }

        /* Style spécifique pour les alertes NON LUES (blanches + shadow) */
        .card-alerte.unread {
            background-color: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .icon-box {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background-color: rgba(0,0,0,0.05);
            font-size: 1.25rem;
        }

        /* Style pour bouton supprimer */
        .btn-delete {
            color: #e74c3c;
            border-color: #e74c3c;
        }
        .btn-delete:hover {
            background-color: #e74c3c;
            color: white;
        }
    </style>
</head>
<body>

    <div class="page-header">
        <div class="container-xl">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-4">
                    <a href="index.php" class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                        <span>←</span> <?= $lang === 'mg' ? 'Hiverina' : 'Retour' ?>
                    </a>
                    <div>
                        <h1 class="h3 mb-0 fw-bold text-dark">
                            🔔 <?= $lang === 'mg' ? 'Fampitandremana' : 'Centre d\'Alertes' ?>
                        </h1>
                        <p class="text-muted small mb-0 mt-1">
                            <?= count($alertes) ?> <?= $lang === 'mg' ? 'fampitandremana hita' : 'notifications trouvées' ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container-xl pb-5">
        
        <!-- Message de succès (optionnel) -->
        <?php if (isset($_GET['success'])): ?>
            <div class="alert alert-success alert-dismissible fade show">
                <?= $_GET['success'] === 'deleted' ? 
                    ($lang === 'mg' ? 'Voafafa soa aman-tsara ny fampitandremana!' : 'Alerte supprimée avec succès !') :
                    ($lang === 'marked' ? ($lang === 'mg' ? 'Voamarika ho voavaky!' : 'Marquée comme lue !') : '') ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <?php if (count($alertes) > 0): ?>
            <div class="row row-cols-1 row-cols-md-2 g-4">
                
                <?php foreach ($alertes as $alerte): ?>
                <div class="col">
                    <div class="card card-alerte h-100 <?= $alerte['lu'] ? 'read' : 'unread' ?>" 
                         style="border-left-color: <?= getPriorityColor($alerte['priorite']) ?>;">
                        
                        <div class="card-body d-flex flex-column">
                            
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="icon-box">
                                        <?= getAlertIcon($alerte['type_alerte']) ?>
                                    </div>
                                    <div>
                                        <div class="fw-bold text-uppercase small text-muted">
                                            <?= htmlspecialchars($alerte['type_alerte']) ?>
                                        </div>
                                        <small class="text-muted">
                                            <?= formatDate($alerte['date_alerte']) ?>
                                        </small>
                                    </div>
                                </div>
                                
                                <span class="badge bg-<?= getBootstrapClass($alerte['priorite']) ?> bg-opacity-10 text-<?= getBootstrapClass($alerte['priorite']) ?> border border-<?= getBootstrapClass($alerte['priorite']) ?> rounded-pill">
                                    <?= $alerte['priorite'] === 'Haute' ? '⚠️ ' : '' ?>
                                    <?= $lang === 'mg' ? 
                                        ($alerte['priorite'] === 'Haute' ? 'Maika' : ($alerte['priorite'] === 'Moyenne' ? 'Antonony' : 'Malemy')) 
                                        : $alerte['priorite'] ?>
                                </span>
                            </div>

                            <div class="mb-3 flex-grow-1">
                                <h5 class="card-title fw-bold mb-2">
                                    <?= htmlspecialchars($alerte['titre']) ?>
                                </h5>
                                <p class="card-text text-secondary">
                                    <?= nl2br(htmlspecialchars($alerte['message'])) ?>
                                </p>
                                
                                <?php if ($alerte['nom_produit']): ?>
                                <div class="mt-2 p-2 bg-light rounded border d-inline-flex align-items-center gap-2 small text-muted">
                                    <span>🌱</span>
                                    <span><?= $lang === 'mg' ? 'Misakana : ' : 'Concerne : ' ?><strong><?= htmlspecialchars($alerte['nom_produit']) ?></strong></span>
                                </div>
                                <?php endif; ?>
                            </div>

                            <div class="pt-3 border-top d-flex justify-content-between align-items-center">
                                <div>
                                    <?php if (!$alerte['lu']): ?>
                                        <a href="?mark_read=<?= $alerte['id_alerte'] ?>" class="btn btn-sm btn-outline-success d-flex align-items-center gap-2">
                                            <span>✓</span> <?= $lang === 'mg' ? 'Marquer voavaky' : 'Marquer comme lu' ?>
                                        </a>
                                    <?php else: ?>
                                        <span class="text-muted small d-flex align-items-center gap-1">
                                            <span class="text-success">✓✓</span> <?= $lang === 'mg' ? 'Voavaky' : 'Lu' ?>
                                        </span>
                                    <?php endif; ?>
                                </div>

                                <!-- BOUTON SUPPRIMER -->
                                <a href="?delete=<?= $alerte['id_alerte'] ?>"
                                   class="btn btn-sm btn-outline-danger btn-delete d-flex align-items-center gap-2"
                                   onclick="return confirm('<?= $lang === 'mg' ? 'Hofafana ve tokoa ity fampitandremana ity? Tsy azo averina intsony!' : 'Supprimer définitivement cette alerte ? Cette action est irréversible !' ?>');">
                                    <span>🗑️</span> <?= $lang === 'mg' ? 'Fafao' : 'Supprimer' ?>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
                
            </div>

        <?php else: ?>
            <div class="text-center py-5 bg-white rounded-3 shadow-sm border mt-4">
                <div class="display-1 mb-3 text-muted">🔕</div>
                <h3 class="h4 text-dark"><?= $lang === 'mg' ? 'Tsy misy fampitandremana' : 'Aucune alerte' ?></h3>
                <p class="text-muted"><?= $lang === 'mg' ? 'Tsara izany! Tsy misy zavatra maika' : 'Tout va bien! Vous n\'avez aucune notification en attente.' ?></p>
            </div>
        <?php endif; ?>
        
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>