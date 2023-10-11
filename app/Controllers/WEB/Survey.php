<?php

namespace App\Controllers\WEB;

class Survey extends \App\Controllers\BaseController
{
    public function index()
    {
		return view('survey/index');
    }
}
