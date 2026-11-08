<?php
require_once 'config.php';
requireLogin();

$paysan = getCurrentPaysan();
$lang = getUserLang();

// Traitement de l'ajout d'observation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_observation'])) {
    $db = Database::getInstance()->getConnection();
    
    $saison_id = intval($_POST['saison_id']);
    // Assurez-vous que sanitize est définie et sécurise les entrées
    $date = sanitize($_POST['date_observation']);
    $type = sanitize($_POST['type_observation']);
    $description = sanitize($_POST['description']);
    
    $stmt = $db->prepare("
        INSERT INTO JOURNAL (id_saison, date_observation, type_observation, description)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$saison_id, $date, $type, $description]);
    
    // Redirection pour éviter la soumission multiple
    header('Location: journal.php?success=1');
    exit();
}

// Récupérer les saisons actives du paysan (pour le formulaire d'ajout)
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("
    SELECT s.*, p.nom_produit, p.nom_malagasy, pa.nom_parcelle
    FROM SAISON s
    JOIN PARCELLE pa ON s.id_parcelle = pa.id_parcelle
    JOIN PRODUIT p ON s.id_produit = p.id_produit
    WHERE pa.id_paysan = ? AND s.statut = 'En cours'
    ORDER BY s.date_semis DESC
");
$stmt->execute([$_SESSION['paysan_id']]);
$saisons = $stmt->fetchAll();

// Récupérer toutes les observations récentes
$stmt = $db->prepare("
    SELECT j.*, s.date_semis, p.nom_produit, p.nom_malagasy, pa.nom_parcelle
    FROM JOURNAL j
    JOIN SAISON s ON j.id_saison = s.id_saison
    JOIN PRODUIT p ON s.id_produit = p.id_produit
    JOIN PARCELLE pa ON s.id_parcelle = pa.id_parcelle
    WHERE pa.id_paysan = ?
    ORDER BY j.date_observation DESC
    LIMIT 50
");
$stmt->execute([$_SESSION['paysan_id']]);
$observations = $stmt->fetchAll();

function getObsIcon($type) {
    $icons = [
        'Pluie' => '🌧️',
        'Parasites' => '🐛',
        'Maladie' => '🦠',
        'Croissance' => '🌱',
        'Autre' => '📝'
    ];
    return $icons[$type] ?? '📝';
}

function getObsBadgeClass($type) {
    return match($type) {
        'Pluie' => 'info',
        'Parasites' => 'danger',
        'Maladie' => 'danger',
        'Croissance' => 'success',
        default => 'secondary'
    };
}
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tantsaha Connect - <?= $lang === 'mg' ? 'Boky' : 'Journal' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f0f2f5;
            min-height: 100vh;
        }

        /* En-tête de page pour Desktop */
        .page-header {
            background: #3e7c41;
            padding: 1.5rem 0;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        
        /* Liste des observations */
        .obs-card {
            transition: transform 0.2s;
        }
        .obs-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1)!important;
        }

        /* Message de succès personnalisé */
        .alert-custom-success {
            background-color: #d4edda;
            border-color: #c3e6cb;
            color: #155724;
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
                            📝 <?= $lang === 'mg' ? 'Bokin\'ny voly' : 'Journal des observations' ?>
                        </h1>
                        <p class="text-muted small mb-0 mt-1">
                            <?= $lang === 'mg' ? 'Fanamarihana farany' : 'Historique des 50 dernières observations' ?>
                        </p>
                    </div>
                </div>
                
                <?php if (count($saisons) > 0): ?>
                <button class="btn btn-success fw-bold d-flex align-items-center gap-2 px-4 py-2" 
                        data-bs-toggle="modal" data-bs-target="#addObsModal">
                    ➕ <?= $lang === 'mg' ? 'Fandraisana fanamarihana' : 'Nouvelle observation' ?>
                </button>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <div class="container-xl pb-5">

        <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-custom-success text-center fw-bold mb-4" role="alert">
            ✓ <?= $lang === 'mg' ? 'Voasoratra soa aman-tsara!' : 'Observation ajoutée avec succès!' ?>
        </div>
        <?php endif; ?>
        
        <div class="row g-4">
            
            <div class="col-12">
                <h2 class="h5 fw-bold mb-3 text-secondary">
                    <?= $lang === 'mg' ? 'Fanamarihana farany' : 'Liste des observations' ?>
                </h2>
                
                <?php if (count($observations) > 0): ?>
                    <div class="row row-cols-1 row-cols-md-2 g-4">
                        <?php foreach ($observations as $obs): ?>
                        <div class="col">
                            <div class="card obs-card h-100 shadow-sm border-0">
                                <div class="card-body">
                                    <div class="d-flex align-items-center mb-3">
                                        <div class="me-3 fs-3">
                                            <?= getObsIcon($obs['type_observation']) ?>
                                        </div>
                                        <div>
                                            <span class="badge rounded-pill bg-<?= getObsBadgeClass($obs['type_observation']) ?> text-uppercase small me-2">
                                                <?= htmlspecialchars($obs['type_observation']) ?>
                                            </span>
                                            <small class="text-muted">
                                                <?= formatDate($obs['date_observation']) ?>
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <p class="card-text text-dark">
                                        <?= nl2br(htmlspecialchars($obs['description'])) ?>
                                    </p>
                                    
                                    <div class="pt-3 border-top mt-3 small text-muted">
                                        <div class="mb-1">
                                            🌱 
                                            <strong><?= $lang === 'mg' && $obs['nom_malagasy'] ? 
                                                $obs['nom_malagasy'] : $obs['nom_produit'] ?></strong>
                                        </div>
                                        <div>
                                            📍 <?= htmlspecialchars($obs['nom_parcelle']) ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                
                <?php else: ?>
                    <div class="text-center py-5 bg-white rounded-3 shadow-sm border">
                        <div class="display-1 mb-3 text-muted">📓</div>
                        <h3 class="h4 text-dark"><?= $lang === 'mg' ? 'Tsy mbola misy fanamarihana' : 'Aucune observation enregistrée' ?></h3>
                        <p class="text-muted"><?= $lang === 'mg' ? 'Manomboha manoratra ny zavatra hitanao' : 'Utilisez le bouton "Nouvelle observation" pour commencer à noter vos observations.' ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="addObsModal" tabindex="-1" aria-labelledby="addObsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold" id="addObsModalLabel">
                        ➕ <?= $lang === 'mg' ? 'Fanamarihana vaovao' : 'Nouvelle observation' ?>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="modal-body">
                    <?php if (count($saisons) > 0): ?>
                    <form method="POST">
                        <div class="mb-3">
                            <label for="saison_id" class="form-label fw-bold">🌱 <?= $lang === 'mg' ? 'Voly' : 'Culture' ?></label>
                            <select name="saison_id" id="saison_id" class="form-select" required>
                                <option value="">-- <?= $lang === 'mg' ? 'Safidio' : 'Choisir' ?> --</option>
                                <?php foreach ($saisons as $saison): ?>
                                <option value="<?= $saison['id_saison'] ?>">
                                    <?= htmlspecialchars($lang === 'mg' && $saison['nom_malagasy'] ? 
                                        $saison['nom_malagasy'] : $saison['nom_produit']) ?> 
                                    - <?= htmlspecialchars($saison['nom_parcelle']) ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="date_observation" class="form-label fw-bold">📅 <?= $lang === 'mg' ? 'Daty' : 'Date' ?></label>
                            <input type="date" name="date_observation" id="date_observation" class="form-control" value="<?= date('Y-m-d') ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="type_observation" class="form-label fw-bold">🏷️ <?= $lang === 'mg' ? 'Karazana' : 'Type' ?></label>
                            <select name="type_observation" id="type_observation" class="form-select" required>
                                <option value="">-- <?= $lang === 'mg' ? 'Safidio' : 'Choisir' ?> --</option>
                                <option value="Pluie">🌧️ <?= $lang === 'mg' ? 'Orana' : 'Pluie' ?></option>
                                <option value="Parasites">🐛 <?= $lang === 'mg' ? 'Kankana' : 'Parasites' ?></option>
                                <option value="Maladie">🦠 <?= $lang === 'mg' ? 'Aretina' : 'Maladie' ?></option>
                                <option value="Croissance">🌱 <?= $lang === 'mg' ? 'Fitomboana' : 'Croissance' ?></option>
                                <option value="Autre">📝 <?= $lang === 'mg' ? 'Hafa' : 'Autre' ?></option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label for="description" class="form-label fw-bold">📝 <?= $lang === 'mg' ? 'Fanazavana' : 'Description' ?></label>
                            <textarea name="description" id="description" class="form-control" rows="4" 
                                      placeholder="<?= $lang === 'mg' ? 'Inona no hitanao? Soraty eto...' : 'Décrivez ce que vous avez observé...' ?>" 
                                      required></textarea>
                        </div>
                        
                        <button type="submit" name="add_observation" class="btn btn-success w-100 fw-bold py-3 mt-2">
                            ✓ <?= $lang === 'mg' ? 'Hampiditra' : 'Enregistrer l\'observation' ?>
                        </button>
                    </form>
                    <?php else: ?>
                    <div class="alert alert-warning text-center">
                        <?= $lang === 'mg' ? 'Mila manana voly En cours aloha vao afaka manoratra fanamarihana.' : 'Vous devez avoir des cultures "En cours" pour enregistrer une observation.' ?>
                    </div>
                    <a href="parcelles.php" class="btn btn-primary w-100">
                        → <?= $lang === 'mg' ? 'Handeha any amin\'ny tanimboly' : 'Aller aux parcelles' ?>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>