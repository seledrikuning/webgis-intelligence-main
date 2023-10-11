<?php

namespace App\Controllers\WEB;

class Home extends \App\Controllers\BaseController
{
    public function index()
    {
        return view('dashboard/index');
    }

    public function login()
    {
        return view('login');
    }
    public function register()
    {
        return view('register');
    }

    public function forgotpassword()
    {
        return view('forgot_password');
    }

    public function changepassword()
    {
        return view('change_password');
    }
}