import map from '../map';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import $ from 'jquery';

$(".item-wrapper[role='layer-switcher']").each(function () {
  const name = $(this).find("input[type='checkbox']").attr('id');
  const brightness = $(this).find("input[type='range']").val();

  let layer;

  $(this)
    .find("input[type='checkbox']")
    .on('change', function () {
      let notif = $(this).closest('.list-badge').find('#notif');
      const total = parseInt(notif.attr('data-value'));

      if ($(this).is(':checked')) {
        layer = new TileLayer({
          source: new TileWMS({
            url: `https://dev.abbauf.com/cgi-bin/mapserv?map=MAPMAP`,
            params: { LAYERS: name, TILED: true },
            serverType: 'geoserver',
            transition: 0,
            zIndex: Infinity,
          }),
          title: name,
        });

        layer.setOpacity(brightness / 100);
        layer.setVisible(true);
        map.addLayer(layer);

        notif.attr('data-value', total + 1);
        notif.html(notif.attr('data-value'));
      } else {
        map.removeLayer(layer);
        layer = undefined;
        notif.attr('data-value', total - 1);
        notif.html(notif.attr('data-value'));
      }

      if (parseInt(notif.attr('data-value')) <= 0) {
        notif.css({ display: 'none' });
      } else {
        notif.css({ display: 'block' });
      }
    });

  $(this)
    .find("input[type='range']")
    .on('input', function () {
      layer.setOpacity($(this).val() / 100);
    });
});

let dataAPI;
let url = process.env['app.baseURL'] + '/api/layerdefaults/';

async function getJson(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function convertToSentenceCase(str) {
  const words = str.split('_');

  const transformedWords = words.map(word => {
    const transformedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return transformedWord;
  });

  return transformedWords.join(' ');
}


async function main() {
  dataAPI = await getJson(url);
  const lp = dataAPI.map((e) => e.layer_parent);
  const unique = new Set(lp);
  Array.from(unique);

  const groupedLayers = {};
  const layerName = {};
  dataAPI.forEach((item) => {
    if (!groupedLayers[item.layer_param]) {
      groupedLayers[item.layer_param] = [];
    }

    groupedLayers[item.layer_param].push(item.validation.split('=')[1]);
    layerName[item.layer_param] = item.layer_parent;
  });

  const poisData = dataAPI.filter((item) => item.layer_param === 'pois');
  const result = [];

  poisData.forEach(function (feature) {
    result.push({
      link: feature.link,
      validation: feature.validation,
      layer_title: feature.layer_title,
      layer_param: feature.layer_param,
    });
  });

  let data = groupedLayers;

  for (let category in data) {
    let li = $(`
            <li class="list-badge" name="${category}">
                <a class="has-arrow place-menu" href="javascript:;" aria-expanded="false">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span class="badge badge-danger badge-counter" id="notif" data-value="0"></span>
                    ${layerName[category]}
                </a>
                
            </li>
        `);

    let ul = $(`
            <ul aria-expanded="false" class="mm-collapse">
            
            `);

    let map_url =
    process.env['app.baseURL'] + '/map?map=/var/www/html/intellegence-map/all.map';

    for (let i = 0; i < data[category].length; i++) {
      let layerP;

      ul.append(
        $(`
                <div class="item-wrapper" role="layer-switcher">
                    <div class="brightness-wrapper" id="switch">
                        <span class="back-icon switch"></span>
                        <div class="brightness-box">
                            <input type="range" id="range" name="brightness-${i}" min="0" max="100" value="100">
                            <span>100</span>
                        </div>
                    </div>
                    <div class="over-zone"></div>
                    <span class="brightness-icon" style="filter: invert(100%)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                            <path d="M16 5a1 1 0 0 0 1-1V2a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1zm14 10h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zM16 27a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zM4 15H2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zm2.808-6.778a1 1 0 0 0 1.414-1.414L6.808 5.394a1 1 0 0 0-1.414 1.414zm18.384-2.828-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 1 0-1.414-1.414zm0 18.384a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414zm-18.384 0-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414zM16 7a8.981 8.981 0 0 0-7.061 3.437A8.175 8.175 0 0 0 7 16a8.175 8.175 0 0 0 1.939 5.563A9 9 0 1 0 16 7zm-4 14a2.207 2.207 0 0 1-1.578-.789 6.956 6.956 0 0 1-1.371-3.4 6.442 6.442 0 0 1 0-1.618 6.956 6.956 0 0 1 1.371-3.4A2.206 2.206 0 0 1 12 11c1.626 0 3 2.29 3 5s-1.374 5-3 5zm4 2a6.943 6.943 0 0 1-2.315-.4C15.634 21.649 17 19.092 17 16s-1.366-5.649-3.315-6.6A7 7 0 1 1 16 23z" />
                        </svg>
                    </span>
                    <label for="${data[category][i]}-${i}" class="layer-item-label">
                        <li class="layer-item-list">
                            <div class="layer-name">
                                <span>${convertToSentenceCase(data[category][i])}</span>
                            </div>
                            <div class="toggle-btn" id="_3rd-toggle-btn">
                                <input type="checkbox" class='layer-check' id="${data[category][i]}-${i}" name="${data[category][i]}">
                                <span></span>
                            </div>
                        </li>
                    </label>
                </div>
            `)
          .children('.layer-item-label')
          .find('input.layer-check')
          .on('change', function () {
            const name = this.name.toLowerCase();
            const nameParent = $(this).closest('.list-badge').attr('name');

            if ($(this).is(':checked')) {
              layerP = new TileLayer({
                source: new TileWMS({
                  url: `${map_url}`,
                  params: {
                    TILED: true,
                    layers: `${nameParent}`,
                    fclass: `${name}`,
                  },
                  transition: 0,
                  serverType: 'mapserver',
                }),
              });

              map.addLayer(layerP);
            } else {
              map.removeLayer(layerP);
              layerP = undefined;
            }
          })
          .end()
          .end()
      );
    }

    li.append(ul);
    $('#layer').append(li);
  }

  $('.place-menu').click(function () {
    if (!$(this).parent().hasClass('mm-active')) {
      $(this).parent().addClass('mm-active');
      $(this).next().addClass('mm-show');
      $(this).attr('aria-expanded', true);
    } else {
      $(this).parent().removeClass('mm-active');
      $(this).next().removeClass('mm-show');
      $(this).attr('aria-expanded', false);
    }
  });

  $('.switch').hover(function () {
    if (!$(this).parent().hasClass('show')) {
      $(this).parent().addClass('show');
    } else {
      $(this).parent().removeClass('show');
    }
  });

  $('.item-wrapper').each(function () {
    let wrapper = $(this);
    $(this)
      .children('.over-zone')
      .on('mouseenter', function () {
        wrapper.children('.brightness-wrapper').addClass('show');
      });
    $(this)
      .children('.over-zone')
      .on('mouseleave', function () {
        wrapper.children('.brightness-wrapper').removeClass('show');
      });

    wrapper.children('.brightness-wrapper').on('mouseenter', function () {
      wrapper.children('.brightness-wrapper').addClass('show');
    });
    wrapper.children('.brightness-wrapper').on('mouseleave', function () {
      wrapper.children('.brightness-wrapper').removeClass('show');
    });
  });

  $('.brightness-wrapper span.back-icon').on('click', function () {
    $(this).parent().toggleClass('show');
  });

  $('.brightness-box').each(function () {
    let val = $(this).children('input').val();
    let span = $(this).children('span');
    let indicator = $(this).parent().parent().children('span.brightness-icon');

    $(this)
      .children('input')
      .on('input', function (e) {
        span.html(e.target.value);
        indicator.css('filter', `invert(${e.target.value}%)`);
      });
  });
}

main();
