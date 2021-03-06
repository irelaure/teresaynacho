$(document).ready(function () {

  $.ajax({
    url: 'https://nachoyteresa-f82bd.firebaseio.com/rsvp.json?auth=qSVTlCu91v6Z0luFKkraXyqIvzVn7Z2piRhJY66J',
    success: function (respuesta) {

      var _review = getInfoPeople(respuesta);
      paintHeader(_review);

      var invitees = Object.values(respuesta);
      var partners = Object.values(respuesta).filter(g => g.partners).map(g => g.partners).flat();
      var everybody = invitees.concat(partners);
      var alergies = everybody.filter(g => g.alergies);
      var bus = everybody.filter(g => g.autobus);

      paintTableSections(respuesta, _review);
      paintTableTotal(everybody, '#table_allguest');
      paintTableTotal(bus, '#table_onlybus');
      paintTableTotal(alergies, '#table_onlyalergies');
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });

  $('#guest').on('click', '.card-header', function () {

    _button = $(this).find('.see');
    if (_button.hasClass('clicked')) {
      $('#guest .card-body').removeClass('show');
      $('#guest .see').removeClass('clicked');
    } else {
      $('#guest .card-body').removeClass('show');
      $('#guest .see').removeClass('clicked');
      var _box = _button.closest('.asistente');
      _box.find('.card-body').addClass('show');
      _button.addClass('clicked');
    }
  });

});

function getInfoPeople(respuesta) {

  var _review = { 'confirms': 0, 'total': 0, 'bussi': 0, 'alergies': 0 };

  _review['confirms'] = Object.keys(respuesta).length;
  _review['total'] = _review['confirms'] + Object.values(respuesta).filter(g => g.partners).map(g => g.partners.length).reduce((a, b) => a + b, 0);

  alergies_tmp = Object.values(respuesta).filter(g => g.alergies).length;
  _review['alergies'] = alergies_tmp + Object.values(respuesta).filter(g => g.partners).map(g => g.partners).flat().filter(g => g.alergies).length;

  bussi_tmp = Object.values(respuesta).filter(g => g.autobus).length;
  _review['bussi'] = bussi_tmp + Object.values(respuesta).filter(g => g.partners).map(g => g.partners).flat().filter(g => g.autobus).length;

  return _review;

}
function paintHeader(_review) {
  $('#review_confirms').html(_review['confirms']);
  $('#review_total').html(_review['total']);
  $('#review_bussi').html(_review['bussi']);
  $('#review_alergies').html(_review['alergies']);
}

function paintTableSections(respuesta, _review) {

  var _content = '';
  $.each(respuesta, function (index, guest) {

    _count_partners = guest['partners'] ? guest['partners'].length : 0;
    guest_bus = guest['autobus'] ? 'Bus sí' : 'Bus no';
    guest_alergies = guest['alergies'] ? guest['alergies'] : '';
    _content += '<div class="card my-3 asistente">\
                  <h5 class="card-header">\
                    <div class="row">\
                      <div class="col-3">' + guest['name'] + ' ' + guest['surname'] + '</div>\
                      <div class="col-3">' + guest['email'] + '</div>\
                      <div class="col-3 text-center">' + guest['phone'] + '</div>\
                      <div class="col-3 text-center">' + _count_partners + ' inv. <i class="fa fa-plus see" aria-hidden="true"></i></div>\
                    </div>\
                  </h5>\
                  <div class="card-body">\
                  <p class="card-text"><strong>'+ guest_bus + '</strong></p>';
    if (guest_alergies)
      _content += '<p class="card-text">Alergias: ' + guest_alergies + '</p>';

    if (guest['partners']) {
      _content += '<p class="card-text"><strong>INVITADOS:</strong></p>';
      $.each(guest['partners'], function (index, partner) {
        partner_bus = partner['autobus'] ? 'Bus sí' : 'Bus no';
        partner_alergies = partner['alergies'] ? partner['alergies'] : '';
        _content += '<p class="invitado ml-3 my-2">\
                      - ' + partner['name'] + ' ' + partner['surname'];
        
        _content += '<p class="ml-5 my-2">' + partner_bus + '</p>';
        if (partner_alergies) {
          _content += '<p class="ml-5 my-2">\
          Alergias: ' + partner_alergies + '</p>';
        }
        _content += '</p>';
      });
    }
    _content += '   </div>\
                </div>';
  });

  $('#guest').html(_content);
}

function paintTableTotal(everybody, tableclass) {

  $(tableclass).bootstrapTable({
    columns: [{
      field: 'name',
      title: 'Nombre'
    }, {
      field: 'surname',
      title: 'Apellidos'
    },
    {
      field: 'email',
      title: 'Correo electrónico'
    },
    {
      field: 'phone',
      title: 'Teléfono'
    },
    {
      field: 'alergies',
      title: 'Alergias'
    },
    {
      field: 'autobus',
      title: 'Autobús'
    }],
    data: everybody
  });
}
