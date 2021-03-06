jQuery(document).ready(function($) {
  var template = $($('.template-license').html());
  var $list = $('.license-list');
  var $isOpenData = $('<a href="http://opendefinition.org/okd/" title="Open Data" class="open-icon"><img src="http://assets.okfn.org/images/ok_buttons/od_80x15_blue.png" alt="Open Data" border="" /></a>');
  var $isOpenContent = $('<a href="http://opendefinition.org/okd/" title="Open Data" class="open-icon"><img src="http://assets.okfn.org/images/ok_buttons/oc_80x15_red_green.png" alt="Open Data" border="" /></a>');
  $.each(all_licenses, function(id, data) {
    var tmp = template.clone();
    var jsonUrl = 'licenses/' + id + '.json';
    $.each(data, function(key, value) {
      tmp.find('.tmpl-' + key).html(value);
    });
    tmp.attr('data-license-id', data.id);
    tmp.find('.tmpl-title').attr('href', jsonUrl);
    tmp.find('.tmpl-url').attr('href', data.url);
    if (data.is_okd_compliant && data.domain_data) {
      tmp.find('.icons').append($isOpenData.clone());
    }
    if (data.is_okd_compliant && data.domain_content) {
      tmp.find('.icons').append($isOpenContent.clone());
    }
    $list.append(tmp);
  });

  $('.license-filter').change(onFormChange);
  $('.license-filter').submit(onFormChange);
  $('.license-filter .search-query').keyup(onFormChange);
  $('.license-filter').trigger('submit');
      
  function onFormChange(e) {
    e.preventDefault();
    var $form = $(e.target).closest('form');
    var data = {
      q: '',
      is_od_compliant: null,
      is_osi_compliant: null
    };
    $($form.serializeArray()).each(function(idx, item) {
      data[item.name] = item.value;
    });
    $('.license-list .license').each(function(idx, $el) {
      $el = $($el);
      var matched = false;
      var _id = $el.attr('data-license-id');
      var _lic = all_licenses[_id];
      if (_lic.title.toLowerCase().match(RegExp(data.q))) {
        matched = true;
      }
      if (data.is_osi_compliant) {
        matched = matched && _lic.is_osi_compliant;
      }
      if (data.is_od_compliant) {
        matched = matched && _lic.is_okd_compliant;
      }
      if (matched) {
        $el.show();
      } else {
        $el.hide();
      }
    });
  }
});


