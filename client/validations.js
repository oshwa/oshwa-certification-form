const Validations = {
  scriptsRegex: /[\s<>]/,
  urlRegex: /^(http|https):\/\/?([\da-z.-]+)\.([a-z.]{2,6})([w@.-]*).*?\/?$/,
  setupDOMElements() {
    this.$form = $('form');
    $.validator.setDefaults({ ignore: '' });
  },
  validateForm() {
    $.validator.addMethod(
      'checkCreatedUrls',
      (value, element) => {
        const elName = element.name;
        const urlPair = $(`input[name="${elName}"]`);
        const titleIsValid = urlPair[0].value.length > 0;
        const urlIsValid =
          !Validations.scriptsRegex.test(urlPair[1].value) && Validations.urlRegex.test(urlPair[1].value);
        if (urlPair[0].value.length === 0 && urlPair[1].value.length === 0) {
          return true;
        }
        if (titleIsValid && urlIsValid) {
          return true;
        }
        return false;
      },
      $.validator.format('Citations must have a title and valid url.')
    );
    this.$form.validate({
      rules: {
        responsiblePartyType: { required: true },
        oshwaUid: { required: true },
        responsibleParty: { required: true },
        bindingParty: {
          required: {
            depends() {
              return $("select[name='responsiblePartyType']").val() !== 'Individual';
            }
          }
        },
        country: { required: true },
        streetAddress1: {},
        streetAddress2: {},
        city: {},
        state: {},
        postalCode: {},
        privateContact: {
          required: false,
          email: true
        },
        publicContact: {
          required: false,
          email: true
        },
        projectName: { required: true },
        projectVersion: {},
        previousVersions: {},
        projectDescription: {},
        intendedUseCase: {},
        intendedUseCaseStatement: {},
        projectWebsite: {
          required: false,
          url: true,
          validUrl: true
        },
        primaryType: { required: true },
        additionalType: {},
        projectKeywords: {},
        documentationUrl: {
          required: false,
          url: true,
          validUrl: true
        },
        availableFileFormat: {},
        'citations[]': {
          checkCreatedUrls: true,
          url: true,
          validUrl: true,
          required: false
        },
        hardwareLicense: { required: true },
        softwareLicense: { required: true },
        documentationLicense: { required: true },
        licensingChecklist: {},
        licensingChecklistExplanation: {
          required: {
            depends() {
              const numTerms = $("input[name='licensingChecklist']").length;
              const numSelected = $("input[name='licensingChecklist']:checked").length;
              return numTerms !== numSelected;
            }
          }
        },
        certificationMarkTerms: {},
        explanationCertificationTerms: {
          required: {
            depends() {
              const numTerms = $("input[name='certificationMarkTerms']").length;
              const numSelected = $("input[name='certificationMarkTerms']:checked").length;
              return numTerms !== numSelected;
            }
          }
        },
        relationship: {},
        agreementTerms: { required: true },
        parentName: {},
        certificationDate: { required: true },
        hiddenRecaptcha: {
          required() {
            if (grecaptcha.getResponse() === '') {
              return true;
            }
            return false;
          }
        }
      },
      messages: {
        responsiblePartyType: { required: 'Please select the responsible party type' },
        oshwaUid: { required: '' },
        responsibleParty: { required: 'Please enter the name of the responsible party' },
        bindingParty: {},
        country: { required: 'Please select a country' },
        streetAddress1: {},
        streetAddress2: {},
        city: {},
        state: {},
        postalCode: {},
        privateContact: {},
        publicContact: {},
        projectName: { required: 'Please add a project name' },
        projectVersion: {},
        previousVersions: {},
        projectDescription: {},
        projectWebsite: {},
        primaryType: {
          required:
            'You must select a project type. If your project doesn\'t fall into any of these types, select "Other".'
        },
        additionalType: {},
        projectKeywords: {},
        documentationUrl: {},
        availableFileFormat: {},
        citations: {},
        hardwareLicense: { required: 'You must select a license. If your license is not listed, select "Other"' },
        softwareLicense: {
          required:
            'You must select a license. If your license is not listed, select "Other". If your project doesn\'t use software, select "No software".'
        },
        documentationLicense: { required: 'You must select a license. If your license is not listed, select "Other"' },
        licensingChecklist: {},
        licensingChecklistExplanation: {
          
          required: 'This explanation is required if you did not agree to one or more of the above terms.'
        },
        certificationmarkTerms: {},
        explanationCertificationTerms: {
          required: 'This explanation is required if you did not agree to one or more of the above terms.'
        },
        relationship: {},
        agreementTerms: {
          required:
            'You must agree to the terms of the OSHWA Open Source Hardware Certification Mark License Agreement.'
        },
        parentName: {},
        certificationDate: { required: '' },
        hiddenRecaptcha: { required: 'Please verify you are not a robot.' }
      },
      errorPlacement: (error, element) => {
        if (element[0].tagName === 'SELECT') {
          error.insertAfter(element.parent());
        } else if (element.attr('name') === 'agreementTerms') {
          error.insertAfter(element.parent().parent());
        } else if (element.hasClass('url_create')) {
          element
            .parent()
            .parent()
            .find('.citation-error')
            .text('');
          error.appendTo(
            element
              .parent()
              .parent()
              .find('.citation-error')
          );
        } else {
          error.insertAfter(element);
        }
      }
    });
  },
  addUrlValidation() {
    $.validator.addMethod(
      'validUrl',
      function validateUrl(value, element) {
        if (value.length === 0) {
          return true;
        }
        return this.optional(element) || (!Validations.scriptsRegex.test(value) && Validations.urlRegex.test(value));
      },
      'Please enter a valid URL'
    );
  },
  formIsValid() {
    return this.$form.valid();
  },
  selectErrorMessages() {
    $('select').on('change', e => {
      $(e.currentTarget).valid();
    });

    $('select[name="responsiblePartyType"]').on('change', () => {
      $('input[name="bindingParty"]').valid();
    });
  },
  licensingChecklistMessages() {
    $("input[name='licensingChecklist']").on('change', () => {
      $("textarea[name='licensingChecklistExplanation']").valid();
    });
  },
  certificationCheckboxMessages() {
    $("input[name='certificationmarkTerms']").on('change', () => {
      $("textarea[name='explanationCertificationTerms']").valid();
    });
  },
  urlCitationMessages() {
    // on field creation, add rules
    $('body').on('change', '.url_create', () => {
      $('.url_create').each((idx, input) => {
        $(input).rules('add', { checkCreatedUrls: true });
        $(input).valid();
      });
    });
  },
  dependentSelectMessages() {
    $('.explanation-wrapper').on('change', e => {
      $(e.currentTarget)
        .find('.explanation-field')
        .find('textarea')
        .valid();
    });
  },
  textAreaMessaging() {
    $('textarea').on('keyup', e => {
      const maxLength = 500;
      const textLength = $(e.currentTarget).val().length;
      if (textLength >= maxLength) {
        $(e.currentTarget)
          .parent()
          .find('.textarea-message')
          .text(`${textLength - maxLength} characters over suggested length`)
          .addClass('error-message');
      } else {
        const chars = maxLength - textLength;
        $(e.currentTarget)
          .parent()
          .find('.textarea-message')
          .text(`${chars} characters left`)
          .removeClass('error-message');
      }
    });
  },
  init() {
    this.setupDOMElements();
    this.validateForm();
    this.addUrlValidation();
    this.selectErrorMessages();
    this.textAreaMessaging();
    this.licensingChecklistMessages()
    this.certificationCheckboxMessages();
    this.dependentSelectMessages();
    this.urlCitationMessages();
  }
};

module.exports = Validations;
