const reCAPTCHA = require('recaptcha2');
const { validationResult } = require('express-validator/check');

const {
  getFormOptions,
  getFormValuesFromContentful,
  getIndexFromContentful,
  submitFormToContentful
} = require('../services/contentful');

const Project = require('../models/project');

const { markdownify } = require('../helpers/handlebars');

const siteCopy = require('../config/site_metadata');
// set up recaptcha2
/*  eslint-disable-next-line */
const recaptcha = new reCAPTCHA({
  siteKey: process.env.RECAPTCHA_SITEKEY,
  secretKey: process.env.RECAPTCHA_SECRET
});

// recaptcha config for testing
// const recaptcha = new reCAPTCHA({
//   siteKey: process.env.RECAPTCHA_TEST_SITE_KEY,
//   secretKey: process.env.RECAPTCHA_TEST_SECRET_KEY
// });

/* istanbul ignore next */
const getApplyPage = (req, res, next) => {
  getFormValuesFromContentful()
    .then(contentfulValues => {
      const formOptions = getFormOptions(contentfulValues);
      res.render('apply', formOptions);
    })
    .catch(next);
};

/* istanbul ignore next */
const getConfirmationPage = (req, res) => {
  res.render('confirmation', {
    title: siteCopy.confirmation.title,
    message: siteCopy.confirmation.mainCopy,
    markdownify
  });
};

const getLandingPage = (req, res) => {
  getIndexFromContentful().then(indexContent => {
    const { pageTitle, headerCopy, descriptionHeader, description } = indexContent[0].fields;
    res.render('index', {
      pageTitle,
      headerCopy,
      descriptionHeader,
      description,
      helpers: {
        markdownify
      }
    });
  });
};

/* POST /apply. */
/* istanbul ignore next */
const postApplyPage = (req, res, next) => {
  const inputs = req.body;
  // custom sanitization for url fields
  req.body.documentationUrl = req.sanitize(req.body.documentationUrl);
  req.body.projectWebsite = req.sanitize(req.body.projectWebsite);

  const project = new Project(req.body);
  // server side validations
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // if there are errors, rerender the form with errors
    getFormValuesFromContentful()
      .then(contentfulValues => {
        const formOptions = getFormOptions(contentfulValues, errors.array(), project);
        res.render('apply', formOptions);
      })
      .catch(next);
  } else {
    // form passes server side validations, check recaptcha server-side
    recaptcha
      .validateRequest(req)
      .then(() => {
        // validated and secure, submit the form to contentful
        const fields = project.mapFieldsToContentful();
        submitFormToContentful(fields)
          .then(data => {
            if (data.name === 'InvalidEntry') {
              throw new Error('Invalid Entry');
            } else {
              res.redirect('/confirmation');
            }
          })
          .catch(next);
      })
      .catch(() => {
        // if recaptcha fails, create a recaptcha error and rerender the form with this error
        const recaptchaError = [
          {
            location: 'body',
            param: 'g-recaptcha-response',
            value: undefined,
            msg: 'Please verify you are not a robot.'
          }
        ];
        getFormValuesFromContentful()
          .then(contentfulValues => {
            // invalid, re-render form
            const formOptions = getFormOptions(contentfulValues, recaptchaError);
            res.render('apply', formOptions);
          })
          .catch(next);
      });
  }
};

module.exports = { getApplyPage, getConfirmationPage, getLandingPage, postApplyPage };
