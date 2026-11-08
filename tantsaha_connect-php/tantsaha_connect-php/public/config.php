<?php
// config.php - Configuration de l'application Tantsaha Connect

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'tantsaha_connect');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuration de session
session_start();

// Fuseau horaire
date_default_timezone_set('Indian/Antananarivo');

// Connexion à la base de données
class Database {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->conn = new PDO($dsn, DB_USER, DB_PASS);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            die("Erreur de connexion : " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->conn;
    }
}

// Fonctions utilitaires
function isLoggedIn() {
    return isset($_SESSION['paysan_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}

function getCurrentPaysan() {
    if (!isLoggedIn()) {
        return null;
    }
    
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT * FROM PAYSAN WHERE id_paysan = ?");
    $stmt->execute([$_SESSION['paysan_id']]);
    return $stmt->fetch();
}

function formatDate($date, $format = 'd/m/Y') {
    if (empty($date)) return '';
    return date($format, strtotime($date));
}

function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Traductions Malagasy/Français
$translations = [
    'welcome' => ['fr' => 'Bienvenue', 'mg' => 'Tonga soa'],
    'meteo' => ['fr' => 'Météo', 'mg' => 'Toetr\'andro'],
    'alerts' => ['fr' => 'Alertes', 'mg' => 'Fampitandremana'],
    'journal' => ['fr' => 'Journal', 'mg' => 'Boky'],
    'advice' => ['fr' => 'Conseils', 'mg' => 'Torohevitra'],
    'parcels' => ['fr' => 'Parcelles', 'mg' => 'Tanimboly'],
    'logout' => ['fr' => 'Déconnexion', 'mg' => 'Hivoaka'],
];

function t($key, $lang = 'mg') {
    global $translations;
    return $translations[$key][$lang] ?? $key;
}

function getUserLang() {
    $paysan = getCurrentPaysan();
    return $paysan ? strtolower($paysan['langue_preferee']) : 'mg';
}
?>