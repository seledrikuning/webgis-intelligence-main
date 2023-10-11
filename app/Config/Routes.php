<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (is_file(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
// The Auto Routing (Legacy) is very dangerous. It is easy to create vulnerable apps
// where controller filters or CSRF protection are bypassed.
// If you don't want to define all routes, please use the Auto Routing (Improved).
// Set `$autoRoutesImproved` to true in `app/Config/Feature.php` and set the following to true.
// $routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
// $routes->get('/', 'Home::index');

$routes->group('auth', ['namespace' => 'App\Controllers\WEB'], static function ($routes) {
    $routes->get('login', 'Home::login');
    $routes->get('register', 'Home::register');
    $routes->get('forgot-password', 'Home::forgotpassword');
    $routes->get('change-password', 'Home::changepassword');
});

$routes->group('', ['namespace' => 'App\Controllers\WEB'], static function ($routes) {
    $routes->get('/testing', 'Dashboard::testing');
});

// TODO: Filter auth for all routes in this group
$routes->group('', ['namespace' => 'App\Controllers\WEB', 'filter' => 'auth'], static function ($routes) {
    $routes->get('/', 'Home::index');

    // temporary routes 
    $routes->get('/dashboard/survey', 'Dashboard::survey');

    // DASHBOARD ADMIN
    $routes->group('admin', static function ($routes) {
        $routes->group('dashboard', static function ($routes) {
            $routes->get('/', 'Dashboard::index');
            $routes->get('management-user', 'Dashboard::managementuser');
            $routes->get('package-setting', 'Dashboard::packagesetting');
            $routes->get('poi', 'Dashboard::poi');
            $routes->get('shp', 'Dashboard::shp');
        });
    });
    // DASHBOARD USER
    $routes->group('user', static function ($routes) {
        $routes->group('dashboard', static function ($routes) {
            $routes->get('/', 'User::index');
            $routes->get('management-user', 'User::managementuser');
            $routes->get('package', 'User::package');
            $routes->get('poi', 'User::poi');
            $routes->get('shp', 'User::shp');
            $routes->get('user-information', 'User::userInformation');
            $routes->get('webgis', 'Webgis::index');
        });
    });

    //POI
    $routes->get('pois', 'POI::index');
});

/*
* --------------------------------------------------------------------
* REST API
* --------------------------------------------------------------------
*/

$routes->group('api', ['namespace' => 'App\Controllers\API'], static function ($routes) {
    $routes->post('auth/register', 'Auth::register');
    $routes->post('auth/login', 'Auth::login');
    $routes->get('auth/logout', 'Auth::logout');
    $routes->get('auth/glogin', 'Auth::google_login');
    $routes->get('auth/flogin', 'Auth::facebook_login');
    $routes->post('auth/forgot-password/', 'Auth::forgotPassword');
    $routes->get('auth/reset-password/(:num)', 'Auth::resetPasswordPage/$1');
    $routes->put('auth/reset-password', 'Auth::resetPassword');

    $routes->get('users/request-package', 'Request::listRequestPackageUser');
    $routes->get('users/request-package/(:num)', 'Request::getPackageUserByID');
    $routes->put('users/request-package/(:num)', 'Request::acceptRequestUser');

    $routes->post('users/ajax', 'Users::indexAjax');
    $routes->post('packages/ajax', 'Packages::indexAjax');
    // $routes->post('packages/create', 'Packages::create ');
    $routes->post('features/ajax', 'Features::indexAjax');
    $routes->post('shps/ajax', 'SHPs::indexAjax');

    $routes->post('layerswitchers/ajax', 'LayerSwitchers::indexAjax');
    $routes->post('detail_packages/ajax', 'DetailPackages::indexAjax');
    $routes->get('packages/list-public', 'Packages::publicList');

    //routes menampilkan view datatables-layerdefaults
    $routes->get('layerdefaults', 'LayerDefaults::index');
    $routes->get('layerdefaults/(:num)', 'LayerDefaults::show/$1');
    $routes->post('layerdefaults/batch', 'LayerDefaults::batchCreate');
    $routes->post('layerdefaults/create', 'LayerDefaults::create');
    $routes->put('layerdefaults/(:num)/edit', 'LayerDefaults::update/$1');
    $routes->delete('layerdefaults/(:num)/delete', 'LayerDefaults::delete/$1');

    $routes->get('grid-analysis', 'GridAnalysis::index');
    $routes->get('circle-analysis', 'CircleAnalysis::index');

});

//With authentication
$routes->group('api', ['namespace' => 'App\Controllers\API', 'filter' => 'auth'], static function ($routes) {
    $routes->post('auth/verify-account', 'Auth::sendVerifyAccount');
    $routes->put('auth/verify-account/(:num)', 'Auth::verifyAccount/$1');
    $routes->get('auth/profile/(:num)', 'Auth::getProfile/$1');
    $routes->post('auth/change-password', 'Auth::changePassword');
    $routes->post('auth/verify-account', 'Auth::sendVerifyAccount');
    $routes->put('auth/verify-account/email', 'Auth::verifyAccount');
    $routes->get('auth/profile', 'Auth::getProfile');
    $routes->put('auth/profile/update', 'Auth::updateProfile');
    $routes->post('auth/profile/picture', 'Auth::changePicture');
    $routes->post('chart/users', 'Chart::chartPackage');
    $routes->post('chart/poi-growth', 'Chart::chartPOI');
    // $routes->get('pay', 'Payment::index');
    // $routes->post('pay', 'Payment::index');
    $routes->get('transactions/pay', 'Transactions::snap');
    $routes->post('transactions/pay', 'Transactions::snap');
    $routes->get('users/list-admin', 'Users::listAdmin');
    $routes->get('users/list-user', 'Users::listUsers');
    $routes->post('users/request-package', 'Request::requestPackageCustom');

    //Front End
    $routes->resource('users');
    $routes->resource('surveys');
    // REVIEWED: Has been change the controller, because linux is case sensitive.
    $routes->resource('pois', ['controller' => 'POIs']); 
    $routes->resource('shps', ['controller' => 'SHPs']);
    $routes->resource('layer-switchers', ['controller' => 'LayerSwitchers']);
    $routes->resource('transactions');
    $routes->resource('layers');
    $routes->resource('features');
    $routes->resource('packages');
    $routes->resource('detail-packages', ['controller' => 'DetailPackages']);
    $routes->resource('req-packages', ['controller' => 'Request']);

    // $routes->resource('payments');
});

/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (is_file(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
