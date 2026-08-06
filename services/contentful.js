const contentfulDelivery = require('contentful');
const contentfulManagement = require('contentful-management');

const contentfulDeliveryApiKey = process.env.OSHWA_CONTENTFUL_DELIVERY_KEY;

const spaceID = process.env.OSHWA_CONTENTFUL_SPACE_ID;
const environmentID = process.env.OSHWA_CONTENTFUL_ENVIRONMENT_ID;
const contentModelType = 'project';

const contentfulClient = contentfulManagement.createClient({
  accessToken: process.env.OSHWA_CONTENTFUL_MANAGEMENT_KEY
});

const contentfulDeliveryClient = contentfulDelivery.createClient({
  space: spaceID,
  accessToken: contentfulDeliveryApiKey,
  environment: process.env.OSHWA_CONTENTFUL_ENVIRONMENT_ID
});

const siteMetadata = require('../config/site_metadata');

const helpers = require('../helpers/handlebars');

const { apply } = siteMetadata;

const sectionOne = require('../config/form_fields/section-1-questions.json');
const sectionTwo = require('../config/form_fields/section-2-questions.json');
const sectionThree = require('../config/form_fields/section-3-questions.json');
const sectionFour = require('../config/form_fields/section-4-questions.json');

const getAllProjects = (limitOption = 1000, skipOption = 0, allData) => {
  let limit = limitOption;
  let skip = skipOption;
  allData = allData || [];
  return contentfulDeliveryClient
    .getEntries({
      content_type: 'project',
      skip,
      limit,
      order: 'fields.oshwaUid',
      select: ['fields.oshwaUid', 'fields.responsibleParty', 'fields.projectName']
    })
    .then(response => {
      allData = allData.concat(response.items);
      if (response.items.length == limit) {
        return getAllProjects(limit, limit + skip, allData);
      }
      return allData;
    })
    .catch(console.error);
};

// Get Projects List
/* istanbul ignore next */
const getProjectsList = () => {
  return getAllProjects();
};

// GET Validations
const getValidationDropdownItems = (contentType, id) =>
  contentType.fields.filter(item => item.id === id)[0].validations[0].in;
const getValidationCheckboxItems = (contentType, id) =>
  contentType.fields.filter(item => item.id === id)[0].items.validations[0].in;

const getValidationsFromContentful = contentModel => {
  const countryOptions = getValidationDropdownItems(contentModel, 'country');
  const responsiblePartyTypeOptions = getValidationDropdownItems(contentModel, 'responsiblePartyType');
  const primaryProjectTypes = getValidationDropdownItems(contentModel, 'primaryType').filter(item => item !== 'Health');
  const additionalProjectTypes = getValidationCheckboxItems(contentModel, 'additionalType');
  const hardwareLicenses = getValidationDropdownItems(contentModel, 'hardwareLicense');
  const softwareLicenses = getValidationDropdownItems(contentModel, 'softwareLicense');
  const documentationLicenses = getValidationDropdownItems(contentModel, 'documentationLicense');
  return [
    {
      countryOptions,
      responsiblePartyTypeOptions,
      primaryProjectTypes,
      additionalProjectTypes,
      hardwareLicenses,
      softwareLicenses,
      documentationLicenses
    }
  ];
};

/* istanbul ignore next */
const getValidations = () =>
  contentfulClient
    .getSpace(spaceID)
    .then(space => space.getEnvironment(environmentID))
    .then(environment =>
      environment.getContentType(contentModelType).then(contentModel => getValidationsFromContentful(contentModel))
    )
    .catch(console.error);

// get examples from learning learningModuleExamples
/* istanbul ignore next */
const getLearningModulesFromContentful = () =>
  contentfulDeliveryClient.getEntries({
    content_type: 'learningModule',
    select: ['fields.moduleTitle', 'fields.examples'],
    include: 2
  });

const getExamplesFromData = contentfulData => {
  const examples = {};
  const softwareExamples = contentfulData.items.filter(item => item.fields.moduleTitle === 'Software');
  examples.softwareExamples = softwareExamples[0].fields.examples;
  const hardwareExamples = contentfulData.items.filter(item => item.fields.moduleTitle === 'Hardware');
  examples.hardwareExamples = hardwareExamples[0].fields.examples;
  const documentationExamples = contentfulData.items.filter(item => item.fields.moduleTitle === 'Documentation');
  examples.documentationExamples = documentationExamples[0].fields.examples;
  return examples;
};

/* istanbul ignore next */
const getExamplesFromLearningModules = () =>
  getLearningModulesFromContentful()
    .then(response => getExamplesFromData(response))
    .catch(console.error);

/* istanbul ignore next */
const submitFormToContentful = fields =>
  contentfulClient
    .getSpace(spaceID)
    .then(space => space.getEnvironment(environmentID))
    .then(environment => environment.createEntry(contentModelType, { fields }))
    .catch(console.error);

/* istanbul ignore next */
const getFormValuesFromContentful = () =>
  Promise.all([getProjectsList(), getValidations(), getExamplesFromLearningModules()]);

const getFormOptions = (contentfulValues, errors, project) => {
  const [projectsList, validations, learningModuleExamples] = contentfulValues;
  const formOptions = {
    ...apply,
    sectionOne,
    sectionTwo,
    sectionThree,
    sectionFour,
    helpers: {
      ...helpers
    },
    projectsList,
    ...validations[0],
    learningModuleExamples
  };
  if (errors) {
    formOptions.errors = errors;
  }
  if (project) {
    formOptions.project = project;
  }
  return formOptions;
};

const getIndexFromContentful = () =>
  contentfulDeliveryClient
    .getEntries({
      content_type: 'certificationPage'
    })
    .then(response => response.items)
    .catch(console.error);

module.exports = {
  getFormValuesFromContentful,
  getFormOptions,
  getExamplesFromData,
  getExamplesFromLearningModules,
  getIndexFromContentful,
  getLearningModulesFromContentful,
  getProjectsList,
  getValidationDropdownItems,
  getValidationCheckboxItems,
  getValidationsFromContentful,
  getValidations,
  submitFormToContentful
};
