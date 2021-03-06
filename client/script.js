const DynamicForms = require('./dynamic_forms');
const Modal = require('./modal');
const Nav = require('./nav');
const Overlay = require('./overlay');
const Validations = require('./validations');
const Utils = require('./utils');

DynamicForms.init();
Modal.init();
Nav.init();
Overlay.init();
Validations.init();
Utils.markdownLinksNewPage();
