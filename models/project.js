const {
  isAddUrlField,
  returnUrlToObj,
  isReferenceField,
  returnReferences,
  isBoolean,
  returnBooleanFromCheckbox,
  isCheckboxArray,
  returnArrayFromCheckbox,
  isCheckboxObject,
  returnCertificationObjectFromCheckbox,
  isBooleanSelect,
  returnBooleanFromSelect,
  isArrayField,
  returnArrayFromTextField,
  returnLicensingChecklistItems
} = require('../helpers/form_helpers.js');

const { removeElFromArray } = require('../helpers/utils');

function Project(data) {
  Object.assign(this, data);
  this.previousVersions = data['previousVersions[]'];

  // this.oshwaUid = data.oshwaUid;
  // this.responsiblePartyType = data.responsiblePartyType;
  // this.responsibleParty = data.responsibleParty;
  // this.bindingParty = data.bindingParty;
  // this.country = data.country;
  // this.streetAddress1 = data.streetAddress1;
  // this.streetAddress2 = data.streetAddress2;
  // this.city = data.city;
  // this.state = data.state;
  // this.postalCode = data.postalCode;
  // this.privateContact = data.privateContact;
  // this.publicContact = data.publicContact;
  // this.projectName = data.projectName;
  // this.projectWebsite = data.projectWebsite;
  // this.projectVersion = data.projectVersion;
  // this['previousVersions[]'] = data['previousVersions[]'];
  // this.projectDescription = data.projectDescription;
  // this.primaryType = data.primaryType;
  // this.additionalType = data.additionalType;
  // this.projectKeywords = data.projectKeywords;
  // this.documentationUrl = data.documentationUrl;
  // this.availableFileFormat = data.availableFileFormat;
  // this.citations = data.citations;
  // this.hardwareLicense = data.hardwareLicense;
  // this.softwareLicense = data.softwareLicense;
  // this.documentationLicense = data.documentationLicense;
  // this.noCommercialRestriction = data.noCommercialRestriction;
  // this.explanationNcr = data.explanationNcr;
  // this.noDocumentationRestriction = data.noDocumentationRestriction;
  // this.explanationNdr = data.explanationNdr;
  // this.openHardwareComponents = data.openHardwareComponents;
  // this.explanationOhwc = data.explanationOhwc;
  // this.creatorContribution = data.creatorContribution;
  // this.explanationCcr = data.explanationCcr;
  // this.noUseRestriction = data.noUseRestriction;
  // this.explanationNur = data.explanationNur;
  // this.redistributedWork = data.redistributedWork;
  // this.explanationRwr = data.explanationRwr;
  // this.noSpecificProduct = data.noSpecificProduct;
  // this.explanationNsp = data.explanationNsp;
  // this.noComponentRestriction = data.noComponentRestriction;
  // this.explanationNor = data.explanationNor;
  // this.technologyNeutral = data.technologyNeutral;
  // this.explanationTn = data.explanationTn;
  // this.certificationmarkTerms = data.certificationmarkTerms;
  // this.explanationCertificationTerms = data.explanationCertificationTerms;
  // this.relationship = data.relationship;
  // this.agreementTerms = data.agreementTerms;
  // this.parentName = data.parentName;
  // this.parentalAgreement = data.parentalAgreement;
}

Project.prototype.mapFieldsToContentful = function mapFieldsToContentful() {
  // const defaultLicenseFields = [
  //   'creatorContribution',
  //   'noComponentRestriction',
  //   'noDocumentationRestriction',
  //   'noSpecificProduct',
  //   'noUseRestriction',
  //   'openHardwareComponents',
  //   'redistributedWork',
  //   'technologyNeutral'
  // ];

  let keys = Object.keys(this);
  // remove recaptcha fields from contentful response
  keys = removeElFromArray(keys, 'hiddenRecaptcha');
  keys = removeElFromArray(keys, 'g-recaptcha-response');

  const fields = {};
  let citations = [];
  keys.forEach(key => {
    let keyValue;
    if (isAddUrlField(key)) {
      // create a single array of created url values from form elements with name 'citations[x]'
      citations = citations.concat(this[key]);
    } else if (isBoolean(key)) {
      keyValue = returnBooleanFromCheckbox(this[key]);
    } else if (isCheckboxArray(key)) {
      const checkedValues = returnArrayFromCheckbox(this[key]);
      if (checkedValues.length !== 0) {
        keyValue = checkedValues;
      }
    } else if (isCheckboxObject(key)) {
      keyValue = returnCertificationObjectFromCheckbox(this[key]);
    } else if (isBooleanSelect(key)) {
      keyValue = returnBooleanFromSelect(this[key]);
    } else if (isReferenceField(key)) {
      keyValue = returnReferences(this[key]);
    } else if (isArrayField(key)) {
      keyValue = returnArrayFromTextField(this[key]);
    } else {
      keyValue = this[key] || '';
    }
    if (!isAddUrlField(key)) {
      fields[key] = {
        'en-US': keyValue
      };
    }
  });
  // add citations input values to contentful field name
  fields.citations = { 'en-US': returnUrlToObj(citations) };

  fields.licensingChecklist = {'en-US': returnLicensingChecklistItems(this['licensingChecklist'])}

  delete fields['previousVersions[]'];
  return fields;
};

module.exports = Project;
