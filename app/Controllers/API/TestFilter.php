<?php

namespace App\Controllers\API;
use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ModelAuth;
class TestFilter extends BaseController
{
    use ResponseTrait;
    public function index()
    {
        $login = session()->auth;

        var_dump($login);
    }
}
