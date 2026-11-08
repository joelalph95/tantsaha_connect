<?php
require_once 'config.php';
requireLogin();

$paysan = getCurrentPaysan();
$lang = getUserLang();
$success = '';
$error = '';

// Mise à jour du profil
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_profile'])) {
    $db = Database::getInstance()->getConnection();
    
    $nom = sanitize($_POST['nom']);
    $prenom = sanitize($_POST['prenom']);
    $langue = sanitize($_POST['langue']);
    $niveau = sanitize($_POST['niveau_education']);
    
    $stmt = $db->prepare("
        UPDATE PAYSAN 
        SET nom = ?, prenom = ?, langue_preferee = ?, niveau_education = ?
        WHERE id_paysan = ?
    ");
    
    if ($stmt->execute([$nom, $prenom, $langue, $niveau, $_SESSION['paysan_id']])) {
        $success = $lang === 'mg' ? 'Vita soa aman-tsara ny fanovana!' : 'Profil mis à jour avec succès!';
        $paysan = getCurrentPaysan();
        $lang = getUserLang();
    } else {
        $error = $lang === 'mg' ? 'Nisy olana' : 'Erreur lors de la mise à jour';
    }
}

// Changement de mot de passe
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $db = Database::getInstance()->getConnection();
    
    $old_password = $_POST['old_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    
    if (password_verify($old_password, $paysan['mot_de_passe'])) {
        if ($new_password === $confirm_password) {
            if (strlen($new_password) >= 4) {
                $hashed = password_hash($new_password, PASSWORD_DEFAULT);
                $stmt = $db->prepare("UPDATE PAYSAN SET mot_de_passe = ? WHERE id_paysan = ?");
                if ($stmt->execute([$hashed, $_SESSION['paysan_id']])) {
                    $success = $lang === 'mg' ? 'Voaova ny tenimiafina!' : 'Mot de passe changé avec succès!';
                } else {
                    $error = $lang === 'mg' ? 'Nisy olana' : 'Erreur';
                }
            } else {
                $error = $lang === 'mg' ? 'Ny tenimiafina dia tokony 4 litera farafahakeliny' : 'Le mot de passe doit avoir au moins 4 caractères';
            }
        } else {
            $error = $lang === 'mg' ? 'Tsy mitovy ny tenimiafina' : 'Les mots de passe ne correspondent pas';
        }
    } else {
        $error = $lang === 'mg' ? 'Diso ny tenimiafina taloha' : 'Ancien mot de passe incorrect';
    }
}

// Statistiques
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("SELECT COUNT(*) as count FROM PARCELLE WHERE id_paysan = ?");
$stmt->execute([$_SESSION['paysan_id']]);
$nb_parcelles = $stmt->fetch()['count'];

$stmt = $db->prepare("SELECT COUNT(*) as count FROM SAISON s JOIN PARCELLE p ON s.id_parcelle = p.id_parcelle WHERE p.id_paysan = ? AND s.statut = 'En cours'");
$stmt->execute([$_SESSION['paysan_id']]);
$nb_cultures = $stmt->fetch()['count'];

$stmt = $db->prepare("SELECT COUNT(*) as count FROM JOURNAL j JOIN SAISON s ON j.id_saison = s.id_saison JOIN PARCELLE p ON s.id_parcelle = p.id_parcelle WHERE p.id_paysan = ?");
$stmt->execute([$_SESSION['paysan_id']]);
$nb_observations = $stmt->fetch()['count'];

$stmt = $db->prepare("SELECT COUNT(*) as count FROM ALERTE WHERE id_paysan = ?");
$stmt->execute([$_SESSION['paysan_id']]);
$nb_alertes = $stmt->fetch()['count'];
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tantsaha Connect - <?= $lang === 'mg' ? 'Mombamomba' : 'Profil' ?></title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Nunito', sans-serif; background: #f8fff9; }
        .navbar { background: linear-gradient(90deg, #2e7d32, #4caf50); }
        .navbar-brand, .nav-link { color: white !important; }
        .card { border-radius: 16px; border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .profile-avatar { width: 120px; height: 120px; background: #2e7d32; color: white; font-size: 48px; }
        .stat-card { background: white; border-radius: 12px; padding: 1.5rem; text-align: center; transition: transform .2s; }
        .stat-card:hover { transform: translateY(-5px); }
        .btn-success { background-color: #2e7d32; border: none; }
        .btn-success:hover { background-color: #1b5e20; }
    </style>
</head>
<body class="bg-light">

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand fs-4 fw-bold" href="#">Tantsaha Connect</a>
            <div class="d-flex align-items-center gap-3">
                <a href="index.php" class="btn btn-outline-light">
                    <i class="bi bi-arrow-left"></i> <?= $lang === 'mg' ? 'Tableau de bord' : ' Hiverina' ?>
                </a>
                <div class="text-white d-flex align-items-center gap-2">
                    <i class="bi bi-person-circle fs-4"></i>
                    <span class="fw-semibold"><?= htmlspecialchars($paysan['prenom']) ?></span>
                </div>
            </div>
        </div>
    </nav>

    <div class="container py-5">
        <h1 class="mb-4 text-success fw-bold">
            <i class="bi bi-person-gear"></i>
            <?= $lang === 'mg' ? 'mon profil' : 'monbamoba' ?>
        </h1>

        <!-- Messages -->
        <?php if ($success): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill"></i> <?= htmlspecialchars($success) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill"></i> <?= htmlspecialchars($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <div class="row g-5">
            <!-- Colonne gauche : Infos + Stats -->
            <div class="col-lg-4">
                <!-- Profil -->
                <div class="card mb-4">
                    <div class="card-body text-center pt-4">
                        <div class="profile-avatar rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        <h4 class="mb-1"><?= htmlspecialchars($paysan['prenom'] . ' ' . $paysan['nom']) ?></h4>
                        <p class="text-success mb-3">
                            <i class="bi bi-telephone-fill"></i> <?= htmlspecialchars($paysan['telephone']) ?>
                        </p>
                        <hr>
                        <div class="text-start">
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-mortarboard-fill text-primary fs-4 me-3"></i>
                                <div>
                                    <small class="text-muted"><?= $lang === 'mg' ? 'Ambaratonga' : 'Niveau d\'éducation' ?></small>
                                    <div class="fw-semibold"><?= htmlspecialchars($paysan['niveau_education']) ?></div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-globe2 text-info fs-4 me-3"></i>
                                <div>
                                    <small class="text-muted"><?= $lang === 'mg' ? 'Fiteny' : 'Langue préférée' ?></small>
                                    <div class="fw-semibold"><?= htmlspecialchars($paysan['langue_preferee']) ?></div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="bi bi-calendar-check-fill text-success fs-4 me-3"></i>
                                <div>
                                    <small class="text-muted"><?= $lang === 'mg' ? 'Nisoratra' : 'Membre depuis' ?></small>
                                    <div class="fw-semibold"><?= formatDate($paysan['date_inscription'], 'd/m/Y') ?></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title text-success mb-4">
                            <i class="bi bi-graph-up"></i> <?= $lang === 'mg' ? 'Statistiques' : ' Statistika' ?>
                        </h5>
                        <div class="row g-3 text-center">
                            <div class="col-6">
                                <div class="stat-card border-start border-success border-4">
                                    <h3 class="text-success mb-0"><?= $nb_parcelles ?></h3>
                                    <small class="text-muted"><?= $lang === 'mg' ? 'Parcelles ' : 'Tanimboly' ?></small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="stat-card border-start border-warning border-4">
                                    <h3 class="text-warning mb-0"><?= $nb_cultures ?></h3>
                                    <small class="text-muted"><?= $lang === 'mg' ? 'Cultures ' : 'Voly' ?></small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="stat-card border-start border-primary border-4">
                                    <h3 class="text-primary mb-0"><?= $nb_observations ?></h3>
                                    <small class="text-muted"><?= $lang === 'mg' ? 'Observations' : ' Fanamarihana' ?></small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="stat-card border-start border-danger border-4">
                                    <h3 class="text-danger mb-0"><?= $nb_alertes ?></h3>
                                    <small class="text-muted"><?= $lang === 'mg' ? 'Alertes' : ' Fampitandremana' ?></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Colonne droite : Formulaires -->
            <div class="col-lg-8">
                <!-- Modifier le profil -->
                <div class="card mb-4">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">
                            <i class="bi bi-pencil-square"></i> <?= $lang === 'mg' ? 'Modifier mon profil' : 'Hanavao ny mombamomba ' ?>
                        </h5>
                    </div>
                    <div class="card-body">
                        <form method="POST">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Anarana</label>
                                    <input type="text" name="nom" class="form-control" value="<?= htmlspecialchars($paysan['nom']) ?>" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Fanampin Anarana</label>
                                    <input type="text" name="prenom" class="form-control" value="<?= htmlspecialchars($paysan['prenom']) ?>" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Fiteny</label>
                                    <select name="langue" class="form-select" required>
                                        <option value="Malagasy" <?= $paysan['langue_preferee'] === 'Malagasy' ? 'selected' : '' ?>>Malagasy</option>
                                        <option value="Français" <?= $paysan['langue_preferee'] === 'Français' ? 'selected' : '' ?>>Français</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Ambaratonga pahaizana</label>
                                    <select name="niveau_education" class="form-select" required>
                                        <option value="CEPE" <?= $paysan['niveau_education'] === 'CEPE' ? 'selected' : '' ?>>CEPE</option>
                                        <option value="BEPC" <?= $paysan['niveau_education'] === 'BEPC' ? 'selected' : '' ?>>BEPC</option>
                                        <option value="Baccalauréat" <?= $paysan['niveau_education'] === 'Baccalauréat' ? 'selected' : '' ?>>Baccalauréat</option>
                                        <option value="Autre" <?= $paysan['niveau_education'] === 'Autre' ? 'selected' : '' ?>>manana fahaiza monba ny fambolana</option>
                                        <option value="Non scolarisé" <?= $paysan['niveau_education'] === 'Non scolarisé' ? 'selected' : '' ?>>
                                            fahaiza nolovaina tamin ireo raza be
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="mt-4">
                                <button type="submit" name="update_profile" class="btn btn-success btn-lg">
                                    <i class="bi bi-check2"></i> <?= $lang === 'mg' ? 'Hitahiry' : 'hitahiry' ?>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Changer mot de passe -->
                <div class="card">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="mb-0">
                            <i class="bi bi-shield-lock"></i> <?= $lang === 'mg' ? 'Hanova ny tenimiafina': 'hanova tenimiafina' ?>
                        </h5>
                    </div>
                    <div class="card-body">
                        <form method="POST">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">tenimihafina</label>
                                    <input type="password" name="old_password" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">tenimihafina vaovao</label>
                                    <input type="password" name="new_password" class="form-control" placeholder=" 4 farafakeliny" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">havereno ny tenimihafina vaovao</label>
                                    <input type="password" name="confirm_password" class="form-control" required>
                                </div>
                            </div>
                            <div class="mt-4">
                                <button type="submit" name="change_password" class="btn btn-warning text-dark btn-lg">
                                    <i class="bi bi-key-fill"></i> <?= $lang === 'mg' ? 'Changer le mot de passe' : ' Hanova ny tenimiafina'  ?>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>