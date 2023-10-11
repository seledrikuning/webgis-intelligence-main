<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use Codeigniter\API\ResponseTrait;
use App\Models\UserModel;

class Users extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $model = new UserModel();
        $data['users'] = $model->orderBy('created_at', 'ASC')->findAll();

        return $this->respond($data);
    }
    
    public function show($id = null)
    {
        try {
            $model = new UserModel();
            $transaction = $model->find($id);
            if (!$transaction) {
                return $this->failNotFound('Data tidak ditemukan');
            }
            return $this->respond($transaction);
        } catch (\Throwable $th) {
            return $this->fail('Ooops!, terjadi kesahalan');
        }
    }


    public function indexAjax()
    {
        try {
            $param['draw'] = isset($_REQUEST['draw']) ? $_REQUEST['draw'] : '';
            $start = isset($_REQUEST['start']) ? $_REQUEST['start'] : '';
            $length = isset($_REQUEST['length']) ? $_REQUEST['length'] : '';
            $searchValue = isset($_REQUEST['search']['value']) ? $_REQUEST['search']['value'] : '';

            $model          = new UserModel();
            $data           = $model->searchAndDisplay($searchValue, $start, $length);
            $totalCount     = $model->searchAndDisplay($searchValue);
    
            $jsonData = [
                'draw'              => intval($param['draw']),
                'recordsTotal'      => count($totalCount),
                'recordsFiltered'   => count($totalCount),
                'data'              => $data
            ];
    
            return json_encode($jsonData);
        } catch (\Throwable $th) {
            return $this->fail($th->getMessage());
        }
    }
    
    public function listAdmin()
    {
        try {
            $param['draw'] = isset($_REQUEST['draw']) ? $_REQUEST['draw'] : '';
            $start = isset($_REQUEST['start']) ? $_REQUEST['start'] : '';
            $length = isset($_REQUEST['length']) ? $_REQUEST['length'] : '';
            $searchValue = isset($_REQUEST['search']['value']) ? $_REQUEST['search']['value'] : '';

            $model          = new UserModel();
            $data           = $model->searchAndDisplayAdmin($searchValue, $start, $length);
            $totalCount     = $model->searchAndDisplayAdmin($searchValue);
    
            $jsonData = [
                'draw'              => intval($param['draw']),
                'recordsTotal'      => count($totalCount),
                'recordsFiltered'   => count($totalCount),
                'data'              => $data
            ];
    
            return json_encode($jsonData);
        } catch (\Throwable $th) {
            return $this->fail($th->getMessage());
        }
    }

    public function listUsers()
    { 
        try {
            $param['draw'] = isset($_REQUEST['draw']) ? $_REQUEST['draw'] : '';
            $start = isset($_REQUEST['start']) ? $_REQUEST['start'] : '';
            $length = isset($_REQUEST['length']) ? $_REQUEST['length'] : '';
            $searchValue = isset($_REQUEST['search']['value']) ? $_REQUEST['search']['value'] : '';

            $model          = new UserModel();
            $data           = $model->searchAndDisplayUsers($searchValue, $start, $length);
            $totalCount     = $model->searchAndDisplayUsers($searchValue);
    
            $jsonData = [
                'draw'              => intval($param['draw']),
                'recordsTotal'      => count($totalCount),
                'recordsFiltered'   => count($totalCount),
                'data'              => $data
            ];
    
            return json_encode($jsonData);
        } catch (\Throwable $th) {
            return $this->fail($th->getMessage());
        }
    } 
 
    public function update($id = null)
    {
        helper(['form']);
        $rules = [
            'name' => 'required',
            'email' => 'required',
            'company' => 'required'

        ];
        if (!$this->validate($rules)) return $this->fail($this->validator->getErrors());

        // $data = [  
        //     'name' => $this->request->getRawInput()['name'],
        //     'email' => $this->request->getRawInput()['email'],
        //     'company' => $this->request->getRawInput()['company']
        // ];

        $data = [
            'name' => $this->request->getVar('name'),
            'email' => $this->request->getVar('email'),
            'role' => $this->request->getVar('role'),
        ];

        $model = new UserModel();
        $findById = $model->find(['user_id' => $id]);
         if (!$findById)   return $this->failNotFound('Data Tidak Ditemukan');

        $model->update($id, $data);
        $response = [
            'status' => 200,
            'error'  => null,
            'message' => [
                'success' => 'Data Updated'
            ]
        ];
        return $this->respond($response);
    }

    /**
     * Delete the designated resource object from the model
     *
     * @return mixed
     */

    public function delete($id = null)
    {
        $model = new UserModel();
        $findById = $model->find(['user_id' => $id]);
        if (!$findById)   return $this->failNotFound('Data Tidak Ditemukan');

        $model->delete($id);
        $response = [
            'status' => 200,
            'error'  => null,
            'message' => [
                'success' => 'Data Deleted'
            ]
        ];
        return $this->respond($response);
    }
}