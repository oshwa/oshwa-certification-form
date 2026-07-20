const {
  arrayCheckboxFormFields,
  objectCheckboxFormFields,
  arrayFields,
  booleanFormFields,
  booleanSelectFields,
  referenceFields
} = require('./form_parsers');

const certificationMarkTerms = require('../config/form_fields/section-4-questions.json').field.certificationMarkTerms
  .terms;

const citationsKeyRegex = /^citations\[\d+\]$/;

const isAddUrlField = key =>
  // citations come from dynamically generated  form fields with names 'citations[x]'
  citationsKeyRegex.test(key);

const isArrayField = key => arrayFields.indexOf(key) !== -1;
const isBoolean = key => booleanFormFields.indexOf(key) !== -1;
const isBooleanSelect = key => booleanSelectFields.indexOf(key) !== -1;
const isCheckboxArray = key => arrayCheckboxFormFields.indexOf(key) !== -1;
const isCheckboxObject = key => objectCheckboxFormFields.indexOf(key) !== -1;
const isReferenceField = key => referenceFields.indexOf(key) !== -1;

const returnArrayFromCheckbox = values => {
  if (typeof values === 'string') {
    return values.split();
  }
  return values;
};

const returnArrayFromTextField = str => {
  const arr = str.split(',');
  const results = [];

  arr.forEach(item => {
    results.push(decodeURI(item.trim()));
  });

  return arr;
};

const returnBooleanFromCheckbox = value => !!value;

const returnBooleanFromSelect = values => {
  if (values === 'false') {
    return false;
  }
  return true;
};

const returnCertificationObjectFromCheckbox = values => {
  const certificationMarkTermsValues = {};
  Object.keys(certificationMarkTerms).forEach(term => {
    certificationMarkTermsValues[term] = { agreement: values.indexOf(term) !== -1 };
  });
  return certificationMarkTermsValues;
};

const returnReferences = referenceIDs => {
  const references = [];
  if (!referenceIDs) {
    return [];
  }
  if (typeof referenceIDs === 'string') {
    references.push({ sys: { type: 'Link', linkType: 'Entry', id: referenceIDs } });
  } else {
    referenceIDs.forEach(id => {
      references.push({ sys: { type: 'Link', linkType: 'Entry', id } });
    });
  }
  return references;
};

const returnUrlToObj = urls => {
  const urlsArr = [];
  for (let i = 0; i < urls.length; i += 2) {
    if (urls[i] && urls[i + 1]) {
      urlsArr.push({ title: urls[i], url: urls[i + 1] });
    }
  }
  return urlsArr;
};

const returnLicensingChecklistItems = values => {
  if (typeof values === 'string') {
    return values.split();
  }
  return values;
};

module.exports = {
  certificationMarkTerms,
  citationsKeyRegex,
  isAddUrlField,
  isArrayField,
  isBoolean,
  isBooleanSelect,
  isCheckboxArray,
  isCheckboxObject,
  isReferenceField,
  returnArrayFromTextField,
  returnArrayFromCheckbox,
  returnBooleanFromCheckbox,
  returnBooleanFromSelect,
  returnCertificationObjectFromCheckbox,
  returnReferences,
  returnUrlToObj,
  returnLicensingChecklistItems
};
