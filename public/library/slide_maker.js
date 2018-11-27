let grad_gen = function(gdt) {
  let result = "";
  if (gdt.type == "radial") {}
}

class SlideMaker {
  constructor (template) {
    this.template = template;
  }
  
  init() {
    let self = this;
    $('*[data-role=input]').on('change', function() {
      let target = $(this).attr('data-target'),
        attr = $(this).attr('data-attr'),
        value = $(this).val();
      self.template.set_attr(target, attr, value);
    });
    $('*[data-role=grad-control]').listen_grad();
  }
}

jQuery.fn.listen_grad = function() {
  let wrap = this;
  let data = { type: '', stops: [], grad_id: wrap.attr('grad-id') };
  let n_stops = (wrap.find($('*[data-role=grad-input]')).length - 1) / 2;
  let change_function = function(){
    wrap.find($('*[data-role=grad-input]')).each(function() {
      let role = $(this).attr('grad-role').split('-');
      if (role[2] == 'type') {
        data.type = $(this).val();
      } else if (role[2] == 'stop') {
        if ( data.stops.length < parseInt(role[3]) ) data.stops[parseInt(role[3])-1] = {pos: null, color: null};
        data.stops[parseInt(role[3])-1].pos = $(this).val();
      } else if (role[2] == 'color') {
        if ( data.stops.length < parseInt(role[3]) ) data.stops[parseInt(role[3])-1] = {pos: null, color: null};
        data.stops[parseInt(role[3])-1].color = $(this).val();
      }
    });
    console.log(data)
  }
  wrap.find($('*[data-role=grad-input]')).off('change')
  wrap.find($('*[data-role=grad-input]')).on('change', change_function)
  wrap.find($('button[grad-role=grad-add]')).off('click')
  wrap.find($('button[grad-role=grad-add]')).on('click', function() {
    wrap.append(
      $('<div>').addClass('form-group col-6').append(
        $('<label>').attr('for', 'ctrl_'+data.grad_id+'_grad_stop_'+(n_stops+1)+'_pos').text('Stop '+(n_stops+1)),
        $('<input>').attr('type', 'number').attr('max', '100').attr('min', '0').attr('step', '0.1')
          .attr('grad-role', 'grad-control-stop-'+(n_stops+1)).attr('data-role', 'grad-input')
          .addClass('form-control').val((data.stops[n_stops-1] ? data.stops[n_stops-1].pos : 0))
          .attr('id', 'ctrl_'+data.grad_id+'_grad_stop_'+(n_stops+1)+'_pos').on('change', change_function)
      ),
      $('<div>').addClass('form-group col-6').append(
        $('<label>').attr('for', 'ctrl_'+data.grad_id+'_grad_stop_'+(n_stops+1)+'_color').text('Color'),
        $('<input>').attr('type', 'color').addClass('form-control')
          .attr('grad-role', 'grad-control-color-'+(n_stops+1)).attr('data-role', 'grad-input')
          .val((data.stops[n_stops-1] ? data.stops[n_stops-1].color : 0) )
          .attr('id', 'ctrl_'+data.grad_id+'_grad_stop_'+(n_stops+1)+'_color').on('change', change_function)
      )
    );
    wrap.listen_grad();
  });
}

let visibility_toggle = function(s) {
  let v = $(s).attr('data-show');
  if (v == 'false') $(s).attr('data-show', 'true');
  else $(s).attr('data-show', 'false')
}

let subordinate = function(it) {
  let v = $(it).val();
  //let selected = $(it).find('*[value='+v+']');
  $(it).children().each(function(){
    let sub = $($(this).attr('data-subordinate'));
    if ($(this).val() == v) {
      sub.attr('data-show', 'true');
    } else {
      sub.attr('data-show', 'false');
    }
    
  });
  
}