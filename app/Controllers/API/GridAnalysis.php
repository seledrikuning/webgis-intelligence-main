<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use Codeigniter\API\ResponseTrait;
use App\Models\GridAnalysisModel;
use App\Models\CircleAnalysisModel;

class GridAnalysis extends ResourceController
{
    use ResponseTrait;
    /**
     * Return an array of resource objects, themselves in array format
     *
     * @return mixed
     */
    public function index()
    {

        $model = new GridAnalysisModel();

            $db      = \Config\Database::connect();
            $point = $this->request->getVar('wkt');
            $kriterias = $this->request->getVar('kriterias');
            $tmp = [];

            for($i=0; $i<count($kriterias); $i++){
                $tmp[] = "'".$kriterias[$i]."'";
            }
            $result = join(", ", $tmp);

            $query = $db->query("
            SELECT
                json_build_object ( 'type', 'FeatureCollection', 'features', json_agg ( ST_AsGeoJSON ( T.* ) :: JSON ) ) 
            FROM
                (
                SELECT
                    fclass,
                    NAME,
                    geom --
                    
                FROM
                    gis_osm_pois_free_1 
                WHERE
                    fclass IN ( $result ) 
                    AND  ST_Intersects ( ST_GeomFromText ( '$point' ), geom )
                 
                ) AS T
            ")->getResult();

            $user_id = session('auth')['user_id'];
            
            $hasil = json_decode($query[0]->json_build_object);
            $hasil = json_encode($hasil);
            $data = [
                'user_id' => $user_id,
                'type_analysis' => 'grid',
                'hasil_analysis' => $hasil
            ];
            $model->insert($data);
            
            return $this->respond(json_decode($query[0]->json_build_object), 200);
            // map=C:/ms4w/Apache/htdocs/testmap/all.map&layers=pois&mode=map&fclass=golf_course
    }
    /**
     * Return the properties of a resource object
     *
     * @return mixed
     */
    public function show($id = null)
    {
        
    }

    /**
     * Return a new resource object, with default properties
     *
     * @return mixed
     */
    public function new()
    {
        //
    }

    /**
     * Create a new resource object, from "posted" parameters
     *
     * @return mixed
     */ 
    public function create()
    {
        
        
        
    }

    /**
     * Return the editable properties of a resource object
     *
     * @return mixed
     */
    public function edit($id = null)
    {
        //
    }

    /**
     * Add or update a model resource, from "posted" properties
     *
     * @return mixed
     */
    public function update($id = null)
    {
        //
    }

    /**
     * Delete the designated resource object from the model
     *
     * @return mixed
     */
    public function delete($id = null)
    {
        //
    }
}
