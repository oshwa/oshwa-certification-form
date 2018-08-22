const { check } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const validateProjectFields = [
  check('oshwaUid')
    .trim()
    .escape(),
  check('responsiblePartyType')
    .isLength({ min: 1 })
    .withMessage('Responsible Party Type is required')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('responsibleParty')
    .isLength({ min: 1 })
    .withMessage('Responsible Party is required')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('bindingParty')
    .custom((value, { req }) => {
      if (req.body.responsiblePartyType !== 'Individual' && value.length <= 0) {
        return false;
      } else if (req.body.responsiblePartyType !== 'Individual' && value.length > 0) {
        return true;
      }
      return true;
    })
    .withMessage('Name of the binding party is required if responsible party type is not an individual')
    .trim()
    .escape(),
  check('country')
    .isLength({ min: 1 })
    .withMessage('Country is required')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('streetAddress1')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('streetAddress2')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('city')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('state')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('postalCode')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('privateContact')
    .optional({ checkFalsy: true })
    .isEmail()
    // .normalizeEmail()
    .withMessage('Please enter a valid email address')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('publicContact')
    .optional({ checkFalsy: true })
    .isEmail()
    // .normalizeEmail()
    .withMessage('Please enter a valid email address')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('projectName')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('projectWebsite')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('projectVersion')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('previousVersions')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('projectDescription')
    .trim()
    .escape(),
  check('primaryType')
    .isLength({ min: 1 })
    .withMessage(
      'Primary Type: You must select a project type. If your project doesn\'t fall into any of these types, select "Other".'
    )
    .trim()
    .escape(),
  check('additionalType')
    .trim()
    .escape(),
  check('projectKeywords')
    .trim()
    .escape(),
  check('documentationUrl')
    .isLength({ max: 256 })
    .withMessage('Maximum length is 256 characters')
    .trim()
    .escape(),
  check('availableFileFormat')
    .trim()
    .escape(),
  check('citations')
    .trim()
    .escape(),
  check('hardwareLicense')
    .isLength({ min: 1 })
    .withMessage('Hardware license: You must select a license. If your license is not listed, select "Other"')
    .trim()
    .escape(),
  check('softwareLicense')
    .isLength({ min: 1 })
    .withMessage(
      'Software license: You must select a license. If your license is not listed, select "Other". If your project doesn\'t use software, select "No software".'
    )
    .trim()
    .escape(),
  check('documentationLicense')
    .isLength({ min: 1 })
    .withMessage('Documentation License: You must select a license. If your license is not listed, select "Other"')
    .trim()
    .escape(),
  check('noCommercialRestriction')
    .trim()
    .escape(),
  check('explanationNcr')
    .custom((value, { req }) => {
      if (req.body.noCommercialRestriction === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('noCommercialRestriction: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('noDocumentationRestriction')
    .trim()
    .escape(),
  check('explanationNdr')
    .custom((value, { req }) => {
      if (req.body.noDocumentationRestriction === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('noDocumentationRestriction: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('openHardwareComponents')
    .trim()
    .escape(),
  check('explanationOhwc')
    .custom((value, { req }) => {
      if (req.body.openHardwareComponents === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('openHardwareComponents: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('creatorContribution')
    .trim()
    .escape(),
  check('explanationCcr')
    .custom((value, { req }) => {
      if (req.body.creatorContribution === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('creatorContribution: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('noUseRestriction')
    .trim()
    .escape(),
  check('explanationNur')
    .custom((value, { req }) => {
      if (req.body.noUseRestriction === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('noUseRestriction: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('redistributedWork')
    .trim()
    .escape(),
  check('explanationRwr')
    .custom((value, { req }) => {
      if (req.body.redistributedWork === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('redistributedWork: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('noSpecificProduct')
    .trim()
    .escape(),
  check('explanationNsp')
    .custom((value, { req }) => {
      if (req.body.noSpecificProduct === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('noSpecificProduct: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('noComponentRestriction')
    .trim()
    .escape(),
  check('explanationNor')
    .custom((value, { req }) => {
      if (req.body.noComponentRestriction === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('noComponentRestriction: This explanation is required if you answered no.')
    .trim()
    .escape(),
  check('technologyNeutral')
    .trim()
    .escape(),
  check('explanationTn')
    .custom((value, { req }) => {
      if (req.body.noComponentRestriction === false && value.length <= 0) {
        return false;
      }
      return true;
    })
    .withMessage('noComponentRestriction: This explanation is required if you answered no.'),
  check('certificationMarkTerms'),
  check('explanationCertificationTerms')
    .custom((value, { req }) => {
      const certificationMarkTermsCount = 5;
      if (req.body.certificationMarkTerms === undefined) {
        if (value.length === 0) {
          return false;
        }
        return true;
      }
      if (req.body.certificationMarkTerms.length === certificationMarkTermsCount) {
        return true;
      }
      if (value.length <= 0) {
        switch (typeof value) {
          case 'string':
            if (req.body.certificationMarkTerms.split(' ').length < certificationMarkTermsCount) {
              return false;
            }
            break;
          case 'object':
            if (req.body.certificationMarkTerms.length < certificationMarkTermsCount) {
              return false;
            }
            break;
          default:
            return true;
        }
      }
      return true;
    })
    .withMessage(
      'certificationMarkTerms: This explanation is required if you did not agree to one or more of the certification mark terms.'
    )
    .trim()
    .escape(),
  check('relationship')
    .trim()
    .escape(),
  check('agreementTerms')
    .isLength({ min: 1 })
    .withMessage('You must agree to the terms of the OSHWA Open Source Hardware Certification Mark License Agreement.'),
  check('agreementTerms')
    .trim()
    .escape(),
  check('parentName')
    .trim()
    .escape(),
  check('g-recaptcha-response')
    .isLength({ min: 1 })
    .withMessage('Please verify you are not a robot.')
];

module.exports = validateProjectFields;
