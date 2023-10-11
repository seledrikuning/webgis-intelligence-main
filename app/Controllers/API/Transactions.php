<?php

namespace App\Controllers\API;

use App\Models\TransactionModel;
use App\Models\PackageModel;
use App\Models\UserPackagesModel;
use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class Transactions extends ResourceController
{
    use ResponseTrait;
    /**
     * Return an array of resource objects, themselves in array format
     *
     * @return mixed
     */
    public function index()
    {
        try {
            $model = new TransactionModel();
            return $this->respond($model->findAll());
        } catch (\Throwable $th) {
            return $this->fail('Ooops!, terjadi kesahalan');
        }
    }

    /**
     * Return the properties of a resource object
     *
     * @return mixed
     */
    public function show($id = null)
    {
        try {
            $model = new TransactionModel();
            $transaction = $model->find($id);
            if (!$transaction) {
                return $this->failNotFound('Data tidak ditemukan');
            }
            return $this->respond($transaction);
        } catch (\Throwable $th) {
            return $this->fail('Ooops!, terjadi kesahalan');
        }
    }

    /**
     * Create a new resource object, from "posted" parameters
     *
     * @return mixed
     */
    public function snap($id = null)
    {
        $request = \Config\Services::request();
        $user_id = session()->auth['user_id'];
        // $package_id = '75';
        $package_id = $request->getPost('package_id');
        $price = $request->getPost('price');

        // Set your Merchant Server Key
        \Midtrans\Config::$serverKey = 'SB-Mid-server-4wqYn2NHomHvsQhpCstaZ5ra';
        // Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
        \Midtrans\Config::$isProduction = false;
        // Set sanitization on (default)
        \Midtrans\Config::$isSanitized = true;
        // Set 3DS transaction for credit card to true
        \Midtrans\Config::$is3ds = true;
    
        $package_details = new PackageModel();
        $data = $package_details->find($package_id);
    
        $transaction_details = array(
            'order_id' => rand(),
            'gross_amount' => $data['price'],
        );
    
        $items = array(array(
            'id' => $data['id'],
            'price' => $data['price'],
            'quantity' => 1,
            'name' => $data['name']
        ));
 
        // var_dump($data[0]['id']);
        // die();

        // $customer_details = array(
        //     'first_name'    => "gilang",
        //     'last_name'     => "putra",
        //     'email'         => "gilang@gmail.com",
        //     'phone'         => "08123456789",
        //     'billing_address'  => "-",
        //     'shipping_address' => "-"
        // );

        // $params = array(
        //     'transaction_details' => array(
        //         'order_id' => rand(),
        //         'gross_amount' => $price,
        //         'gross_amount' => $price,
        //         'user_id' => $user_id,
        //         'package_id' => $package_id,
        //     ),
        //     'item_details' => $items,
        //     'customer_details' => $customer_details,
        // );

        $transaction = array(
            'transaction_details' => $transaction_details,
            'item_details' => $items,
            // 'customer_details' => $customer_details,
        );
        
        $snap = \Midtrans\Snap::getSnapToken($transaction);

        // Save $transaction, $snap, dan catat waktu transaksinya
        return $this->respond($snap);
        // $snapdata = array(
        //     'snap' => $snap
        // );

        // return view('dashboard/pay', $snapdata);
    }

    public function create()
    {
        // $notif = new Midtrans\Notification();

        // $transaction = $notif->transaction_status;
        // $type = $notif->payment_type;
        // $order_id = $notif->order_id;
        // $fraud = $notif->fraud_status;

        // $message = 'ok';

        // if ($transaction == 'capture') {
        //     // For credit card transaction, we need to check whether transaction is challenge by FDS or not
        //     if ($type == 'credit_card') {
        //         if ($fraud == 'challenge') {
        //             // TODO set payment status in merchant's database to 'Challenge by FDS'
        //             // TODO merchant should decide whether this transaction is authorized or not in MAP
        //             $message = "Transaction order_id: " . $order_id ." is challenged by FDS";
        //         } else if ($fraud == 'accept') {
        //             // TODO set payment status in merchant's database to 'Success'
        //             $message = "Transaction order_id: " . $order_id ." successfully captured using " . $type;
        //         }
        //     }
        // } elseif ($transaction == 'settlement')
        // {
        //     // TODO set payment status in merchant's database to 'Settlement'
        //     $message = "Transaction order_id: " . $order_id ." successfully transfered using " . $type;
        // } elseif ($transaction == 'pending')
        // {
        //     // TODO set payment status in merchant's database to 'Pending'
        //     $message = "Waiting customer to finish transaction order_id: " . $order_id . " using " . $type;
        // } elseif ($transaction == 'deny')
        // {
        //     // TODO set payment status in merchant's database to 'Denied'
        //     $message = "Payment using " . $type . " for transaction order_id: " . $order_id . " is denied.";
        // } elseif ($transaction == 'expire')
        // {
        //     // TODO set payment status in merchant's database to 'expire'
        //     $message = "Payment using " . $type . " for transaction order_id: " . $order_id . " is expired.";
        // } elseif ($transaction == 'cancel')
        // {
        //     if ($fraud == 'challenge') {
        //       // TODO Set payment status in merchant's database to 'failure'
        //     }
        //     else if ($fraud == 'accept') {
        //       // TODO Set payment status in merchant's database to 'failure'
        //     }
        // }

        // Catat $order_id dan $transaction ke database 
        try {
            $valid = $this->validate([
                // 'user_id' => 'required',
                'package_id' => 'required',
                // 'price' => 'required'
            ]);
            
            if (!$valid) {
                return $this->fail($this->validator->getErrors());
            }

            $model = new TransactionModel();
            $status = \Midtrans\Transaction::status($order_id);
            // $status = "settlement";
            // var_dump($this->request->getVar('transaction_status'));

            if ($status == 'pending') {
                $model->update($order_id, [
                    'transaction_id' => $this->request->getVar('transaction_id'),
                    'order_id' => $this->request->getVar('order_id'),
                    'gross_amount' => $this->request->getVar('gross_amount'),
                    'payment_type' => $this->request->getVar('payment_type'),
                    'transaction_status' => $status,
                    'user_id' => session()->auth['user_id'],
                    'package_id' => $this->request->getVar('package_id'),
                    'pdf_url' => $this->request->getVar('pdf_url')
                ]);
            } elseif ($status == 'success'){
                $model->update($order_id, [
                    'transaction_id' => $this->request->getVar('transaction_id'),
                    'order_id' => $this->request->getVar('order_id'),
                    'gross_amount' => $this->request->getVar('gross_amount'),
                    'payment_type' => $this->request->getVar('payment_type'),
                    'transaction_status' => $status,
                    'user_id' => session()->auth['user_id'],
                    'package_id' => $this->request->getVar('package_id'),
                    'pdf_url' => $this->request->getVar('pdf_url')
                ]);
            } elseif ($status == 'settlement') {
                $model->insert([
                    'transaction_id' => $this->request->getVar('transaction_id'),
                    'order_id' => $this->request->getVar('order_id'),
                    'gross_amount' => $this->request->getVar('gross_amount'),
                    'payment_type' => $this->request->getVar('payment_type'),
                    'transaction_status' => $this->request->getVar('transaction_status'),
                    'user_id' => session()->auth['user_id'],
                    'package_id' => $this->request->getVar('package_id'),
                    'pdf_url' => $this->request->getVar('pdf_url')
                ]);
            } else {
                $model->update($order_id, [
                    'transaction_id' => $this->request->getVar('transaction_id'),
                    'order_id' => $this->request->getVar('order_id'),
                    'gross_amount' => $this->request->getVar('gross_amount'),
                    'payment_type' => $this->request->getVar('payment_type'),
                    'transaction_status' => $status,
                    'user_id' => session()->auth['user_id'],
                    'package_id' => $this->request->getVar('package_id'),
                    'pdf_url' => $this->request->getVar('pdf_url')
                ]);
            }

            // if ($order_id == $user_id) {
            //     // UPDATE USER
            //     $user_packages = new UserPackagesModel();
            //     $user_packages->insert($user_id, [
            //         'package_id' => $this->request->getVar('package_id'),
            //         'status' => $this->request->getVar('status'),
            //         'active_date' => $this->request->getVar('active_date'),
            //         'expired_date' => $this->request->getVar('expired_date')
            //     ]);
            // }

            // // DESTRYO SESSION & CREATE AGAIN
            // session_destroy();

            return $this->respondCreated([
                "message" => "Data berhasil disimpan"
            ]);
        } catch (\Throwable $th) {
            return $this->fail($th->getMessage());
        }
    }

    /**
     * Add or update a model resource, from "posted" properties
     *
     * @return mixed
     */
    public function update($id = null)
    {
        try {
            $valid = $this->validate([
                'pay' => 'required'
            ]);
            if (!$valid) {
                return $this->fail($this->validator->getErrors());
            }
            $model = new TransactionModel();
            $transaction = $model->find($id);
            if (!$transaction) {
                return $this->failNotFound('Data tidak ditemukan');
            }
            $model->update($id, [
                'pay' => $this->request->getVar('pay')
            ]);
            return $this->respondUpdated($model->find($id));
        } catch (\Throwable $th) {
            return $this->fail('Ooops!, terjadi kesahalan');
        }
    }

    /**
     * Delete the designated resource object from the model
     *
     * @return mixed
     */
    public function delete($id = null)
    {
        try {
            $model = new TransactionModel();
            $transaction = $model->find($id);
            if (!$transaction) {
                return $this->failNotFound('Data tidak ditemukan');
            }
            $model->delete($id);
            return $this->respondDeleted([
                'message' => 'Data berhasil dihapus'
            ]);
        } catch (\Throwable $th) {
            return $this->fail('Ooops!, terjadi kesahalan');
        }
    }
}
