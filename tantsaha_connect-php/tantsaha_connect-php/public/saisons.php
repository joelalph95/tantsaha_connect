<?php
require_once 'config.php';
requireLogin();

$paysan = getCurrentPaysan();
$lang = getUserLang();

// Récupérer l'ID de la parcelle
$parcelle_id = isset($_GET['parcelle']) ? intval($_GET['parcelle']) : 0;

// Vérifier que la parcelle appartient bien au paysan
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("SELECT * FROM PARCELLE WHERE id_parcelle = ? AND id_paysan = ?");
$stmt->execute([$parcelle_id, $_SESSION['paysan_id']]);
$parcelle = $stmt->fetch();

if (!$parcelle) {
    header('Location: parcelles.php');
    exit();
}

// Traitement de l'ajout de saison
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_saison'])) {
    $produit_id = intval($_POST['produit_id']);
    $date_semis = sanitize($_POST['date_semis']);
    $date_recolte_prevue = sanitize($_POST['date_recolte_prevue']);
    
    $stmt = $db->prepare("
        INSERT INTO SAISON (id_parcelle, id_produit, date_semis, date_recolte_prevue, statut)
        VALUES (?, ?, ?, ?, 'En cours')
    ");
    $stmt->execute([$parcelle_id, $produit_id, $date_semis, $date_recolte_prevue]);
    
    header("Location: saisons.php?parcelle=$parcelle_id&success=1");
    exit();
}

// Traitement de la récolte
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['recolter'])) {
    $saison_id = intval($_POST['saison_id']);
    $date_recolte = sanitize($_POST['date_recolte_reelle']);
    $quantite = floatval($_POST['quantite_recoltee']);
    $unite = sanitize($_POST['unite_mesure']);
    
    $stmt = $db->prepare("
        UPDATE SAISON 
        SET date_recolte_reelle = ?, quantite_recoltee = ?, unite_mesure = ?, statut = 'Récolté'
        WHERE id_saison = ?
    ");
    $stmt->execute([$date_recolte, $quantite, $unite, $saison_id]);
    
    header("Location: saisons.php?parcelle=$parcelle_id&success=2");
    exit();
}

// Récupérer les saisons de la parcelle
$stmt = $db->prepare("
    SELECT s.*, p.nom_produit, p.nom_malagasy, p.icone, p.duree_culture_jours,
           DATEDIFF(CURDATE(), s.date_semis) as jours_depuis_semis,
           DATEDIFF(s.date_recolte_prevue, CURDATE()) as jours_avant_recolte
    FROM SAISON s
    JOIN PRODUIT p ON s.id_produit = p.id_produit
    WHERE s.id_parcelle = ?
    ORDER BY s.date_semis DESC
");
$stmt->execute([$parcelle_id]);
$saisons = $stmt->fetchAll();

// Récupérer les produits disponibles
$stmt = $db->query("SELECT * FROM PRODUIT ORDER BY nom_produit");
$produits = $stmt->fetchAll();

function getStatutClass($statut) {
    $classes = [
        'En cours' => 'bg-success',
        'Récolté' => 'bg-primary',
        'Abandonné' => 'bg-secondary'
    ];
    return $classes[$statut] ?? 'bg-secondary';
}

function calculateProgress($date_semis, $date_recolte_prevue) {
    $total_jours = (strtotime($date_recolte_prevue) - strtotime($date_semis)) / 86400;
    if ($total_jours <= 0) return 100;
    $jours_ecoules = (time() - strtotime($date_semis)) / 86400;
    $progress = min(100, max(0, ($jours_ecoules / $total_jours) * 100));
    return round($progress);
}
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tantsaha Connect - <?= $lang === 'mg' ? 'Voly' : 'Cultures' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f0f2f5;
            min-height: 100vh;
        }
        
        /* Dashboard Header Style */
        .page-header {
            background: white;
            padding: 1.5rem 0;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .card-saison {
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 12px;
            background: white;
        }
        
        .card-saison:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.08);
            border-color: #2ecc71;
        }

        .icon-circle {
            width: 50px;
            height: 50px;
            background: #e8f5e9;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #2e7d32;
        }

        .progress-slim {
            height: 8px;
            border-radius: 4px;
            background-color: #edf2f7;
        }

        .stat-badge {
            font-size: 0.85rem;
            padding: 0.5em 1em;
            background: #f8f9fa;
            border-radius: 6px;
            color: #6c757d;
            border: 1px solid #dee2e6;
        }
        
        /* Grille adaptative pour ordinateur */
        .card-actions {
            opacity: 0.9;
            transition: opacity 0.2s;
        }
        .card-saison:hover .card-actions {
            opacity: 1;
        }
    </style>
</head>
<body>

    <div class="page-header">
        <div class="container-xl">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-4">
                    <a href="parcelles.php" class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                        <span>←</span> <?= $lang === 'mg' ? 'Hiverina' : 'Retour' ?>
                    </a>
                    <div>
                        <h1 class="h3 mb-1 fw-bold text-dark">
                            🌾 <?= htmlspecialchars($parcelle['nom_parcelle']) ?>
                        </h1>
                        <div class="d-flex gap-3 text-muted small">
                            <span>📐 <?= $parcelle['superficie_ha'] ?> hectares</span>
                            <span class="border-start ps-3">🌍 Sol : <?= htmlspecialchars($parcelle['type_sol']) ?></span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-success d-flex align-items-center gap-2 px-4 py-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#addModal">
                    <span class="fs-5">+</span> 
                    <?= $lang === 'mg' ? 'Voly vaovao' : 'Ajouter une culture' ?>
                </button>
            </div>
        </div>
    </div>

    <div class="container-xl pb-5">
        
        <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
            <?= $_GET['success'] == 1 ? 
                ($lang === 'mg' ? '✅ Voly vaovao nampiana!' : '✅ Culture ajoutée avec succès!') : 
                ($lang === 'mg' ? '✅ Fijinjana vita!' : '✅ Récolte enregistrée avec succès!') ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <?php endif; ?>

        <?php if (count($saisons) > 0): ?>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3 g-4">
                
                <?php foreach ($saisons as $saison): ?>
                <div class="col">
                    <div class="card card-saison h-100">
                        <div class="card-body d-flex flex-column">
                            
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="d-flex gap-3 align-items-center">
                                    <div class="icon-circle">
                                        <?= htmlspecialchars($saison['icone'] ?? '🌾') ?>
                                    </div>
                                    <div>
                                        <h5 class="fw-bold mb-0 text-dark">
                                            <?= htmlspecialchars($lang === 'mg' && $saison['nom_malagasy'] ? $saison['nom_malagasy'] : $saison['nom_produit']) ?>
                                        </h5>
                                        <small class="text-muted">
                                            <?= formatDate($saison['date_semis']) ?>
                                        </small>
                                    </div>
                                </div>
                                <span class="badge rounded-pill <?= getStatutClass($saison['statut']) ?>">
                                    <?= $saison['statut'] ?>
                                </span>
                            </div>

                            <div class="mb-3 flex-grow-1">
                                <?php if ($saison['statut'] === 'En cours'): ?>
                                    <?php $progression = calculateProgress($saison['date_semis'], $saison['date_recolte_prevue']); ?>
                                    
                                    <div class="d-flex justify-content-between small text-muted mb-1">
                                        <span><?= $lang === 'mg' ? 'Fandrosoana' : 'Progression' ?></span>
                                        <span class="fw-bold text-dark"><?= $progression ?>%</span>
                                    </div>
                                    <div class="progress progress-slim mb-3">
                                        <div class="progress-bar bg-success" role="progressbar" style="width: <?= $progression ?>%"></div>
                                    </div>
                                    
                                    <div class="d-flex justify-content-between mt-3">
                                        <span class="stat-badge">
                                            ⏳ <?= abs($saison['jours_depuis_semis']) ?> <?= $lang === 'mg' ? 'andro lasa' : 'jours' ?>
                                        </span>
                                        <span class="stat-badge" style="<?= $saison['jours_avant_recolte'] < 0 ? 'color:#dc3545;border-color:#dc3545;' : 'color:#198754;border-color:#198754;' ?>">
                                            🎯 <?= abs($saison['jours_avant_recolte']) ?> <?= $lang === 'mg' ? 'andro sisa' : 'restants' ?>
                                        </span>
                                    </div>

                                <?php else: ?>
                                    <div class="alert alert-light border mb-0 p-2">
                                        <div class="d-flex align-items-center gap-2 mb-1">
                                            <span>📅</span>
                                            <small class="text-muted"><?= $lang === 'mg' ? 'Nijinja' : 'Récolté le' ?> :</small>
                                            <strong><?= formatDate($saison['date_recolte_reelle']) ?></strong>
                                        </div>
                                        <?php if ($saison['quantite_recoltee']): ?>
                                        <div class="d-flex align-items-center gap-2">
                                            <span>⚖️</span>
                                            <small class="text-muted"><?= $lang === 'mg' ? 'Vokatra' : 'Quantité' ?> :</small>
                                            <strong><?= $saison['quantite_recoltee'] ?> <?= $saison['unite_mesure'] ?></strong>
                                        </div>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <?php if ($saison['statut'] === 'En cours'): ?>
                            <div class="card-actions pt-3 border-top d-flex gap-2">
                                <a href="journal.php" class="btn btn-light btn-sm flex-grow-1 border">
                                    📝 <?= $lang === 'mg' ? 'Naoty' : 'Notes' ?>
                                </a>
                                <button class="btn btn-success btn-sm flex-grow-1" 
                                        onclick="openRecolteModal(<?= $saison['id_saison'] ?>, '<?= htmlspecialchars($lang === 'mg' && $saison['nom_malagasy'] ? $saison['nom_malagasy'] : $saison['nom_produit']) ?>')">
                                    🎯 <?= $lang === 'mg' ? 'Hijinja' : 'Récolter' ?>
                                </button>
                            </div>
                            <?php endif; ?>
                            
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

        <?php else: ?>
            <div class="text-center py-5 bg-white rounded-3 shadow-sm border mt-4">
                <div class="display-4 mb-3">🌱</div>
                <h3 class="h5 text-dark"><?= $lang === 'mg' ? 'Tsy mbola misy voly' : 'Aucune culture enregistrée' ?></h3>
                <p class="text-muted mb-4"><?= $lang === 'mg' ? 'Atomboy amin\'ny fipihana ny bokotra ambony' : 'Commencez par ajouter une culture via le bouton en haut à droite' ?></p>
            </div>
        <?php endif; ?>
    </div>

    <div class="modal fade" id="addModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">➕ <?= $lang === 'mg' ? 'Voly vaovao' : 'Nouvelle culture' ?></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form method="POST">
                        <div class="mb-3">
                            <label class="form-label text-muted small text-uppercase fw-bold">Type</label>
                            <select name="produit_id" class="form-select" required onchange="updateDuree(this)">
                                <option value="">-- <?= $lang === 'mg' ? 'Safidio' : 'Sélectionner' ?> --</option>
                                <?php foreach ($produits as $prod): ?>
                                <option value="<?= $prod['id_produit'] ?>" data-duree="<?= $prod['duree_culture_jours'] ?>">
                                    <?= htmlspecialchars($lang === 'mg' && $prod['nom_malagasy'] ? $prod['nom_malagasy'] : $prod['nom_produit']) ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label text-muted small text-uppercase fw-bold">Date Semis</label>
                                <input type="date" name="date_semis" id="date_semis" class="form-control" value="<?= date('Y-m-d') ?>" required onchange="updateRecolte()">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label text-muted small text-uppercase fw-bold">Récolte Prévue</label>
                                <input type="date" name="date_recolte_prevue" id="date_recolte_prevue" class="form-control" required>
                            </div>
                        </div>
                        <div class="d-grid mt-3">
                            <button type="submit" name="add_saison" class="btn btn-success py-2">
                                <?= $lang === 'mg' ? 'Hampiditra' : 'Enregistrer la culture' ?>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="recolteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title fw-bold">🎯 <?= $lang === 'mg' ? 'Fijinjana' : 'Enregistrer la récolte' ?></h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form method="POST">
                        <input type="hidden" name="saison_id" id="recolte_saison_id">
                        <h4 class="text-center mb-4 text-dark fw-bold" id="recolte_produit_name"></h4>
                        
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label fw-bold">Date</label>
                                <input type="date" name="date_recolte_reelle" class="form-control" value="<?= date('Y-m-d') ?>" required>
                            </div>
                            <div class="col-md-8">
                                <label class="form-label fw-bold">Quantité</label>
                                <input type="number" name="quantite_recoltee" class="form-control" step="0.01" min="0" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold">Unité</label>
                                <select name="unite_mesure" class="form-select" required>
                                    <option value="kg">kg</option>
                                    <option value="tonne">tonne</option>
                                    <option value="sac">sac</option>
                                    <option value="caisse">caisse</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-grid mt-4">
                            <button type="submit" name="recolter" class="btn btn-success">
                                <?= $lang === 'mg' ? 'Voajinja' : 'Confirmer la récolte' ?>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function updateDuree(select) { updateRecolte(); }
        
        function updateRecolte() {
            const selectProduit = document.querySelector('select[name="produit_id"]');
            const dateSemis = document.getElementById('date_semis');
            const dateRecolte = document.getElementById('date_recolte_prevue');
            
            if (selectProduit.value && dateSemis.value) {
                const option = selectProduit.options[selectProduit.selectedIndex];
                const duree = parseInt(option.getAttribute('data-duree')) || 0;
                const semisDate = new Date(dateSemis.value);
                const recolteDate = new Date(semisDate);
                recolteDate.setDate(recolteDate.getDate() + duree);
                dateRecolte.value = recolteDate.toISOString().split('T')[0];
            }
        }
        
        function openRecolteModal(saisonId, nomProduit) {
            document.getElementById('recolte_saison_id').value = saisonId;
            document.getElementById('recolte_produit_name').textContent = nomProduit;
            new bootstrap.Modal(document.getElementById('recolteModal')).show();
        }
    </script>
</body>
</html>