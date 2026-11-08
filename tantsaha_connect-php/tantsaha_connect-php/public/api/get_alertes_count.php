<?php
/**
 * API - Comptage des alertes actives
 * Retourne le nombre d'alertes actives non expirées
 * 
 * @author Votre Nom
 * @version 1.0
 * @return JSON {success: bool, count: int}
 */

// Configuration des headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Cache-Control: no-cache, must-revalidate');

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée. Utilisez GET.'
    ]);
    exit;
}

/**
 * Configuration de la base de données
 * À MODIFIER selon votre configuration
 */
define('DB_HOST', 'localhost');
define('DB_NAME', 'votre_base_de_donnees');
define('DB_USER', 'votre_utilisateur');
define('DB_PASS', 'votre_mot_de_passe');
define('DB_CHARSET', 'utf8mb4');

/**
 * Fonction pour établir la connexion à la base de données
 * @return PDO|null
 */
function getDatabase() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
        
    } catch (PDOException $e) {
        error_log("Erreur connexion DB : " . $e->getMessage());
        return null;
    }
}

/**
 * Fonction pour compter les alertes actives
 * @param PDO $pdo
 * @return int
 */
function compterAlertesActives($pdo) {
    try {
        // Requête SQL pour compter les alertes actives
        $sql = "SELECT COUNT(*) as total 
                FROM alertes 
                WHERE statut = :statut 
                AND (date_expiration IS NULL OR date_expiration > NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['statut' => 'active']);
        
        $result = $stmt->fetch();
        return (int) $result['total'];
        
    } catch (PDOException $e) {
        error_log("Erreur comptage alertes : " . $e->getMessage());
        return 0;
    }
}

/**
 * Fonction pour envoyer une réponse JSON
 * @param bool $success
 * @param int $count
 * @param string|null $message
 */
function envoyerReponse($success, $count = 0, $message = null) {
    $response = [
        'success' => $success,
        'count' => $count
    ];
    
    if ($message !== null) {
        $response['message'] = $message;
    }
    
    // Ajouter un timestamp pour le cache
    $response['timestamp'] = date('Y-m-d H:i:s');
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// ========================================
// EXECUTION PRINCIPALE
// ========================================

try {
    // Établir la connexion
    $pdo = getDatabase();
    
    if ($pdo === null) {
        http_response_code(500);
        envoyerReponse(false, 0, "Erreur de connexion à la base de données");
    }
    
    // Compter les alertes actives
    $count = compterAlertesActives($pdo);
    
    // Envoyer la réponse de succès
    http_response_code(200);
    envoyerReponse(true, $count);
    
} catch (Exception $e) {
    // Gestion des erreurs générales
    error_log("Erreur API get_alertes_count : " . $e->getMessage());
    
    http_response_code(500);
    envoyerReponse(false, 0, "Une erreur inattendue s'est produite");
}