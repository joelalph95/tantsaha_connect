<?php
require_once 'config.php';
requireLogin();

$paysan = getCurrentPaysan();
$lang = getUserLang();

// Traitement du formulaire d'ajout
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_parcelle'])) {
    $db = Database::getInstance()->getConnection();
    
    $nom = sanitize($_POST['nom_parcelle']);
    $superficie = floatval($_POST['superficie']);
    $type_sol = sanitize($_POST['type_sol']);
    $localisation = intval($_POST['localisation']);
    
    $stmt = $db->prepare("
        INSERT INTO PARCELLE (id_paysan, nom_parcelle, superficie_ha, type_sol, id_localisation)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$_SESSION['paysan_id'], $nom, $superficie, $type_sol, $localisation]);
    
    header('Location: parcelles.php?success=1');
    exit();
}

// Récupérer les parcelles du paysan
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("
    SELECT p.*, l.nom_localite, l.region,
           (SELECT COUNT(*) FROM SAISON WHERE id_parcelle = p.id_parcelle AND statut = 'En cours') as cultures_actives
    FROM PARCELLE p
    LEFT JOIN LOCALISATION l ON p.id_localisation = l.id_localisation
    WHERE p.id_paysan = ?
    ORDER BY p.date_creation DESC
");
$stmt->execute([$_SESSION['paysan_id']]);
$parcelles = $stmt->fetchAll();

// Récupérer les localisations disponibles
$stmt = $db->query("SELECT * FROM LOCALISATION ORDER BY nom_localite");
$localisations = $stmt->fetchAll();

// Statistiques
$total_superficie = array_sum(array_column($parcelles, 'superficie_ha'));
$total_cultures = array_sum(array_column($parcelles, 'cultures_actives'));
$moyenne = count($parcelles) > 0 ? $total_superficie / count($parcelles) : 0;
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tantsaha Connect - <?= $lang === 'mg' ? ' Parcelles' : 'Tanimboly' ?></title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Icons Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Google Fonts (facultatif mais joli) -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Nunito', sans-serif; background: #f8fff9; }
        .navbar { background: linear-gradient(90deg, #2e7d32, #4caf50); }
        .navbar-brand, .nav-link, .text-white { color: white !important; }
        .card-parcelle { transition: transform .2s, box-shadow .2s; border: none; border-radius: 16px; }
        .card-parcelle:hover { transform: translateY(-8px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
        .badge-cultures { background: #2e7d32; }
        .stat-card { background: white; border-radius: 12px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .modal-content { border-radius: 16px; }
        .btn-success { background-color: #2e7d32; border: none; }
        .btn-success:hover { background-color: #1b5e20; }
    </style>
</head>
<body class="bg-light">

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand fs-4 fw-bold" href="#">Tantsaha Connect</a>
            <div class="d-flex align-items-center">
                <a href="index.php" class="btn btn-outline-light me-4">
                    <i class="bi bi-arrow-left"></i> <?= $lang === 'mg' ? ' Tableau de bord ' : 'Hiverina' ?>
                </a>
                <div class="text-white d-flex align-items-center">
                    <i class="bi bi-person-circle fs-3 me-2"></i>
                    <span class="fw-semibold"><?= htmlspecialchars($paysan['prenom']) ?></span>
                </div>
            </div>
        </div>
    </nav>

    <div class="container py-5">

        <!-- Message de succès -->
        <?php if (isset($_GET['success'])): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill"></i>
                <strong><?= $lang === 'mg' ? 'Succès !' : ' Vita soa aman-tsara !' ?></strong>
                <?= $lang === 'mg' ? ' Voampiana ny tanimboly vaovao.' : ' La parcelle a été ajoutée avec succès.' ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <!-- Titre + Bouton ajouter -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="fw-bold text-success">
                    <i class="bi bi-grid-3x3-gap-fill"></i>
                    <?= $lang === 'mg' ? 'Mes parcelles agricoles' : 'Ny tanimboly ' ?>
                </h1>
                <p class="text-muted"><?= $lang === 'mg' ? 'Gestion et suivi de vos parcelles' : ' fitantanana ny tanimboly' ?></p>
            </div>
            <button class="btn btn-success btn-lg shadow" data-bs-toggle="modal" data-bs-target="#addModal">
                <i class="bi bi-plus-circle"></i> <?= $lang === 'mg' ? 'Tanimboly vaovao' : 'Nouvelle parcelle' ?>
            </button>
        </div>

        <!-- Statistiques -->
        <?php if (count($parcelles) > 0): ?>
        <div class="row g-4 mb-5">
            <div class="col-md-3">
                <div class="stat-card">
                    <i class="bi bi-grid-3x3-gap fs-1 text-success"></i>
                    <h3 class="mt-3 mb-0"><?= count($parcelles) ?></h3>
                    <small class="text-muted"><?= $lang === 'mg' ? 'Tanimboly' : 'Parcelles' ?></small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <i class="bi bi-arrows-angle-expand fs-1 text-primary"></i>
                    <h3 class="mt-3 mb-0"><?= number_format($total_superficie, 2) ?> ha</h3>
                    <small class="text-muted"><?= $lang === 'mg' ? 'Superficie totale' : ' Velarana manontolo' ?></small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <i class="bi bi-flower1 fs-1 text-warning"></i>
                    <h3 class="mt-3 mb-0"><?= $total_cultures ?></h3>
                    <small class="text-muted"><?= $lang === 'mg' ? 'Cultures actives' : ' Voly mandeha' ?></small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <i class="bi bi-calculator fs-1 text-info"></i>
                    <h3 class="mt-3 mb-0"><?= number_format($moyenne, 2) ?> ha</h3>
                    <small class="text-muted"><?= $lang === 'mg' ? 'Moyenne par parcelle' : ' Salanisa isaky ny tanimboly' ?></small>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <!-- Liste des parcelles -->
        <?php if (count($parcelles) > 0): ?>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <?php foreach ($parcelles as $parcelle): ?>
                    <div class="col">
                        <div class="card h-100 card-parcelle shadow-sm">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <h5 class="card-title mb-0">
                                        <?= htmlspecialchars($parcelle['nom_parcelle']) ?>
                                    </h5>
                                    <?php if ($parcelle['cultures_actives'] > 0): ?>
                                        <span class="badge rounded-pill badge-cultures text-white">
                                            <i class="bi bi-check2"></i> <?= $parcelle['cultures_actives'] ?> culture<?= $parcelle['cultures_actives'] > 1 ? 's' : '' ?>
                                        </span>
                                    <?php endif; ?>
                                </div>

                                <ul class="list-unstyled text-muted small">
                                    <li class="mb-2"><i class="bi bi-arrows-angle-expand text-primary"></i> <strong><?= $parcelle['superficie_ha'] ?> ha</strong></li>
                                    <li class="mb-2"><i class="bi bi-droplet-fill text-secondary"></i> <?= htmlspecialchars($parcelle['type_sol']) ?></li>
                                    <li class="mb-2"><i class="bi bi-geo-alt-fill text-danger"></i> <?= htmlspecialchars($parcelle['nom_localite']) ?></li>
                                    <li><i class="bi bi-calendar3 text-info"></i> <?= formatDate($parcelle['date_creation'], 'd/m/Y') ?></li>
                                </ul>
                            </div>
                            <div class="card-footer bg-white border-0">
                                <a href="saisons.php?parcelle=<?= $parcelle['id_parcelle'] ?>" class="btn btn-outline-success w-100">
                                    <i class="bi bi-eye"></i> <?= $lang === 'mg' ? 'Hijery ny voly' : 'Voir les cultures' ?>
                                </a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

        <?php else: ?>
            <div class="text-center py-5">
                <i class="bi bi-inbox display-1 text-muted"></i>
                <h3 class="mt-4 text-muted"><?= $lang === 'mg' ? 'Tsy misy tanimboly mbola voasoratra' : 'Aucune parcelle enregistrée' ?></h3>
                <p class="text-muted">
                    <?= $lang === 'mg' ? 'Hanampy ny voalohany amin\'ny alalan\'ny bokotra maitso eo ambony' : 'Ajoutez votre première parcelle avec le bouton vert ci-dessus' ?>
                </p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Modal Ajout Parcelle -->
    <div class="modal fade" id="addModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">
                        <i class="bi bi-plus-circle"></i> <?= $lang === 'mg' ? 'Nouvelle parcelle' : ' Tanimboly vaovao' ?>
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <form method="POST">
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label">Anarana tany</label>
                                <input type="text" name="nom_parcelle" class="form-control" placeholder="<?= $lang === 'mg' ? 'Ex: Parcelle Nord':'Ohatra: Tanimboly voalohany'   ?>" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">fivelarana</label>
                                <input type="number" step="0.01" min="0.01" name="superficie" class="form-control" placeholder="2.5" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">karazan tany</label>
                                <select name="type_sol" class="form-select" required>
                                    <option value="">tany mafy</option>
                                    <option value="Argileux"> Fototany</option>
                                    <option value="Sableux"> Fasika</option>
                                    <option value="Limoneux">Limoneux</option>
                                    <option value="Humifère">Humifère</option>
                                </select>
                            </div>

                            <div class="col-12">
                                <label class="form-label">toherana</label>
                                <select name="localisation" class="form-select" required>
                                    <option value="">-- faritra --</option>
                                    <?php foreach ($localisations as $loc): ?>
                                        <option value="<?= $loc['id_localisation'] ?>">
                                            <?= htmlspecialchars($loc['nom_localite']) ?> - <?= htmlspecialchars($loc['region']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">avela</button>
                        <button type="submit" name="add_parcelle" class="btn btn-success">
                            <i class="bi bi-check2"></i> <?= $lang === 'mg' ? 'enregistre' : 'mitahy' ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>