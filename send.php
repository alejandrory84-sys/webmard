<?php
// Bloquear acceso directo que no sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Método no permitido']));
}

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

// Destinatario
$to = 'aramirez@mardsystems.net';

// Sanitizar entradas
$nombre   = htmlspecialchars(trim($_POST['nombre']   ?? ''), ENT_QUOTES, 'UTF-8');
$empresa  = htmlspecialchars(trim($_POST['empresa']  ?? ''), ENT_QUOTES, 'UTF-8');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono = htmlspecialchars(trim($_POST['telefono'] ?? ''), ENT_QUOTES, 'UTF-8');
$interes  = htmlspecialchars(trim($_POST['interes']  ?? ''), ENT_QUOTES, 'UTF-8');
$mensaje  = htmlspecialchars(trim($_POST['mensaje']  ?? ''), ENT_QUOTES, 'UTF-8');

// Validar campos obligatorios
if (empty($nombre) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Datos inválidos']));
}

// Asunto
$subject = "=?UTF-8?B?" . base64_encode("Nueva consulta web — {$empresa}") . "?=";

// Cuerpo del mail
$body = "NUEVA CONSULTA DESDE MARDSYSTEMS.NET
=====================================

Nombre:    {$nombre}
Empresa:   {$empresa}
Email:     {$email}
Teléfono:  {$telefono}
Servicio:  {$interes}

Mensaje:
{$mensaje}

=====================================
Enviado automáticamente desde mardsystems.net
";

// Cabeceras
$headers  = "From: MARD Systems Web <noreply@mardsystems.net>\r\n";
$headers .= "Reply-To: {$nombre} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al enviar el correo']);
}
