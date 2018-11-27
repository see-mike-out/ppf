let object_member = function (obj, key) {
  if ( Object.keys(obj).indexOf(key) >= 0 ) return true;
  else return false;
}

class SlideTemplate {
  constructor() {
    this.data = {};
    this.data.document = {
      ratio_width: 1,
      ratio_height: 1,
      background: {},
      n_slides: 0
    };
    this.data.slides = {};
  }
  
  add_slide(name) {
    if (!object_member(this.data.slides, name)) this.data.slides[name] = {
      background: {}, elemets: []
    };
  }
  
  add_element(name, type) {
    if (!object_member(this.data.slides, name)) {
      this.data.slides[name].elements.push({type: type, styles: {}});
    }
  }
 
  set_attr(target, attr, value) {
    if (target == 'document') {
      this.data.document[attr] = value;
    }
  }
  
}
