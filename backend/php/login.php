<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conecta.php';

session_start();

$response = ['success' => false, 'message' => ''];

try {
   
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido');
    }

    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $senha = $_POST['senha'] ?? '';

    if (empty($email) || empty($senha)) {
        throw new Exception('Email e senha são obrigatórios');
    }

    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    // Criptografar a senha (usando MD5 como no seu exemplo)
    $senha_hash = md5($senha);

    $query = "SELECT id, nome, email FROM clientes WHERE email = :email AND senha = :senha";
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':email', $email);
    $stmt->bindValue(':senha', $senha_hash);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $_SESSION['user_id'] = $usuario['id'];
        $_SESSION['user_nome'] = $usuario['nome'];
        $_SESSION['user_email'] = $usuario['email'];
        $_SESSION['logged_in'] = true;

        $response['success'] = true;
        $response['message'] = 'Login realizado com sucesso!';
        $response['user'] = [
            'id' => $usuario['id'],
            'nome' => $usuario['nome'],
            'email' => $usuario['email']
        ];
    } else {
        throw new Exception('Email ou senha incorretos');
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(401);
} catch (PDOException $e) {
    $response['message'] = 'Erro no banco de dados: ' . $e->getMessage();
    http_response_code(500);
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>