<?php
require_once 'config.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['login'])) {
        // Connexion
        $telephone = sanitize($_POST['telephone']);
        $password = $_POST['password'];
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM PAYSAN WHERE telephone = ?");
        $stmt->execute([$telephone]);
        $paysan = $stmt->fetch();
        
        if ($paysan && password_verify($password, $paysan['mot_de_passe'])) {
            $_SESSION['paysan_id'] = $paysan['id_paysan'];
            header('Location: index.php');
            exit();
        } else {
            $error = "Diso ny nomerao na ny tenimiafina";
        }
    } elseif (isset($_POST['register'])) {
        // Inscription
        $nom = sanitize($_POST['nom']);
        $prenom = sanitize($_POST['prenom']);
        $telephone = sanitize($_POST['telephone']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
        $niveau_education = sanitize($_POST['niveau_education']);
        $langue = sanitize($_POST['langue']);
        
        if (strlen($password) < 4) {
            $error = " Ny tenimiafina dia mila 4 litera farafahakeliny";
        } elseif ($password !== $confirm_password) {
            $error = " Tsy mitovy ny tenimiafina";
        } else {
            $db = Database::getInstance()->getConnection();
            
            // Vérifier si le téléphone existe déjà
            $stmt = $db->prepare("SELECT id_paysan FROM PAYSAN WHERE telephone = ?");
            $stmt->execute([$telephone]);
            if ($stmt->fetch()) {
                $error = " Efa misy ity nomerao ity";
            } else {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $db->prepare("
                    INSERT INTO PAYSAN (nom, prenom, telephone, mot_de_passe, niveau_education, langue_preferee) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                
                if ($stmt->execute([$nom, $prenom, $telephone, $hashed_password, $niveau_education, $langue])) {
                    $success = " Vita soa aman-tsara ny kaonty!";
                } else {
                    $error = " Nisy olana";
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="mg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tantsaha Connect - Connexion</title>
  <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div class="container">
        <div class="header">
        <div class="logo logo-bootstrap"></div>
            <h1>Tantsaha Connect</h1>
            <p>Fitaovana ho an'ny tantsaha malagasy</p>
        </div>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('login')">
                 Hiditra 
            </button>
            <button class="tab" onclick="showTab('register')">
                 Hisoratra   anarana
            </button>
        </div>
        
        <div class="form-container">
            <?php if ($error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>
            
            <?php if ($success): ?>
            <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
            <?php endif; ?>
            
            <!-- Formulaire de connexion -->
            <div id="login" class="form-section active">
                <form method="POST">
                    <div class="form-group">
                        
                        <div class="icon-input">
                            <input type="tel" name="telephone" placeholder="laharan'ny finday" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        
                        <input type="password" name="password" placeholder="*********" required>
                    </div>
                    
                    <button type="submit" name="login" class="btn">
                         Hiditra 
                    </button>
                </form>
            </div>
            
            <!-- Formulaire d'inscription -->
            <div id="register" class="form-section">
                <form method="POST">
                    <div class="form-group">
                        <label> Anarana </label>
                        <input type="text" name="nom" placeholder="Rakoto" required>
                    </div>
                    
                    <div class="form-group">
                        <label> Fanampiny anarana</label>
                        <input type="text" name="prenom" placeholder="Jean" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Laharana ny finday anao</label>
                        <input type="tel" name="telephone" placeholder=" 034 +" required>
                    </div>
                    
                    <div class="form-group">
                        <label> Ambaratonga pahaizana</label>
                        <select name="niveau_education" required>
                            <option value="CEPE">CEPE</option>
                            <option value="BEPC">BEPC</option>
                            <option value="Autre">fahaizana nolovaina</option>
                            <option value="Non scolarisé">Tsy manana</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Fiteny </label>
                        <select name="langue" required>
                            <option value="Malagasy">Malagasy</option>
                            <option value="fraçais">français</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label> Tenimiafina </label>
                        <input type="password" name="password" placeholder="4 litera farafahakeliny" required>
                    </div>
                    
                    <div class="form-group">
                        <label> Avereno ny tenimiafina </label>
                        <input type="password" name="confirm_password" placeholder="Avereno ny tenimiafina" required>
                    </div>
                    
                    <button type="submit" name="register" class="btn">
                         Hisoratra anarana
                    </button>
                </form>
            </div>
        </div>
    </div>
    
    <script>
        function showTab(tabName) {
            // Cacher toutes les sections
            document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Afficher la section sélectionnée
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }
    </script>
</body>
</html>