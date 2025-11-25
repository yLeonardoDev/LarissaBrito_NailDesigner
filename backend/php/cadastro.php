<?php
// cadastro.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir arquivo de conexão
require_once 'conecta.php';

$response = ['success' => false, 'message' => ''];

try {
    // Verificar se é uma requisição POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método não permitido');
    }

    // Obter dados do POST
    $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $senha = $_POST['senha'] ?? '';
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';

    // Validar campos obrigatórios
    if (empty($nome) || empty($email) || empty($senha) || empty($confirmar_senha)) {
        throw new Exception('Todos os campos são obrigatórios');
    }

    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    // Verificar se as senhas coincidem
    if ($senha !== $confirmar_senha) {
        throw new Exception('As senhas não coincidem');
    }

    // Verificar se o email já existe
    $checkQuery = "SELECT id FROM clientes WHERE email = :email";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->bindValue(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        throw new Exception('Este email já está cadastrado');
    }

    // Criptografar a senha (usando MD5 como no seu exemplo)
    $senha_hash = md5($senha);

    // Inserir no banco de dados
    $insertQuery = "INSERT INTO clientes (nome, email, senha, data_cadastro) 
                   VALUES (:nome, :email, :senha, NOW())";
    
    $insertStmt = $pdo->prepare($insertQuery);
    $insertStmt->bindValue(':nome', $nome);
    $insertStmt->bindValue(':email', $email);
    $insertStmt->bindValue(':senha', $senha_hash);

    if ($insertStmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Cadastro realizado com sucesso!';
        $response['user'] = [
            'id' => $pdo->lastInsertId(),
            'nome' => $nome,
            'email' => $email
        ];
    } else {
        throw new Exception('Erro ao cadastrar usuário');
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(400);
} catch (PDOException $e) {
    $response['message'] = 'Erro no banco de dados: ' . $e->getMessage();
    http_response_code(500);
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>