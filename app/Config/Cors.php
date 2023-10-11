<?php
defined('BASEPATH') OR exit('No direct script access allowed');

// Mendapatkan header Origin dari permintaan
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Daftar domain yang diizinkan untuk mengakses sumber daya di server Anda
$allowed_origins = array(
    'http://localhost:8080', // Ganti dengan domain yang diizinkan
    'http://localhost:8000',
);

// Periksa apakah domain yang diminta ada dalam daftar yang diizinkan
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
}
