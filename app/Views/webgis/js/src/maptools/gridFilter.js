let apiUrl = process.env['app.baseURL'] + '/api/pois';

async function getJson(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function getKriteria() {
  let pois = await getJson(apiUrl);
  listKriteria(pois);
}

function listKriteria(data) {
  $('#FilterGrid').empty();
  return $.each(data, function (i, data) {
    $('#FilterGrid').append(
      `<div class="pb-3">
                <span>${data.fclass}</span>
                    <div class="d-flex align-items-baseline mt-1">
                        <input type="text" class="form-control" style="height: 30px">
                        <span class="mx-3">and</span>
                    <input type="text" class="form-control" style="height: 30px">
                </div>
            </div>`
    );
  });
}

getKriteria();

// close button function
$('.close').on('click', function () {
  $('.collapse').collapse('hide');
});
