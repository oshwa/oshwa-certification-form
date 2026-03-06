const booleanDropdownContent = {
  name: 'createBooleanDropdown',
  hash: {
    selection: undefined,
    formValues: {
      title: 'Lorem ipsum dolor sit amet',
      contentfulFieldName: 'LoremIpsum'
    }
  }
};

const checkboxContent = {
  name: 'createCheckbox',
  hash: {
    formValues: {
      title: 'Lorem ipsum dolor sit amet',
      contentfulFieldName: 'LoremIpsum'
    }
  }
};

const certificationMarkTermsContent = {
  name: 'createCertificationMarkTerms',
  hash: {
    checkedOptions: undefined,
    formValues: {
      title: 'Certificate mark terms question',
      contentfulFieldName: 'certificationMarkTerms',
      type: 'json',
      fieldType: 'checkbox_object',
      instructions: 'Instructions.',
      terms: {
        termOne: {
          title: 'Term One',
          term:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis explicabo doloremque soluta nihil quasi, earum iste culpa et aperiam ab.'
        },
        termTwo: {
          title: 'Term Two',
          term:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis explicabo doloremque soluta nihil quasi, earum iste culpa et aperiam ab.'
        }
      }
    }
  }
};

const checkboxesContent = {
  name: 'createCheckboxes',
  hash: {
    checkedTypes: undefined,
    projectTypes: ['Type One', 'Type Two', 'Type Three'],
    formValues: {
      title: 'Additional Project Types',
      contentfulFieldName: 'additionalType'
    }
  }
};

const dropdownSelectContent = {
  name: 'createDropdownSelect',
  hash: {
    selection: undefined,
    options: ['OptionOne', 'OptionTwo', 'OptionThree', 'OptionFour'],
    formValues: {
      title: "What license is your project's hardware licensed under?",
      contentfulFieldName: 'hardwareLicense',
      hidden: '',
      formPlaceholder: 'Select a license',
      instructions: 'If your license is not listed, choose "Other"'
    }
  }
};

const inputContent = {
  name: 'createInput',
  hash: {
    inputValue: undefined,
    formValues: {
      title: 'Enter your first name',
      contentfulFieldName: 'firstName',
      formPlaceholder: 'Enter your first name',
      instructions: ''
    }
  }
};

const textAreaContent = {
  name: 'createTextArea',
  hash: {
    inputValue: undefined,
    formValues: {
      title: 'Project description',
      contentfulFieldName: 'projectDescription',
      hidden: '',
      formPlaceholder: 'Provide a brief description of your project (500 characters)',
      instructions: 'Please limit your response to 500 characters'
    }
  }
};

const explanationTextAreaContent = {
  name: 'createExplanationTextArea',
  hash: {
    inputValue: undefined,
    hide: undefined,
    formValues: {
      title: 'You answered no, please explain why',
      contentfulFieldName: 'explanation',
      hidden: '',
      formPlaceholder: 'Provide a brief explanation',
      requiredErrorMessage: 'This explanation is required if you answered no.',
      requiredDependency: 'dependentFieldName'
    }
  }
};

const urlInputsContent = {
  name: 'createUrlInputs',
  hash: {
    formValues: {
      title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos, quibusdam!',
      contentfulFieldName: 'citations',
      formPlaceholder: 'Enter a URL including the protocol (e.g https://example.com)',
      instructions: 'Include the protocol to your URL (e.g. http:// or https://)'
    }
  }
};

const previousVersionsContent = {
  name: 'createPreviousVersionsDropdown',
  hash: {
    projectsList: [
      {
        fields: {
          oshwaUid: 'US100',
          responsibleParty: 'Company A',
          projectName: 'Project A'
        },
        sys: {
          id: '100'
        }
      },
      {
        fields: {
          oshwaUid: 'US100',
          responsibleParty: 'Company B',
          projectName: 'Project B'
        },
        sys: {
          id: '200'
        }
      }
    ],
    formValues: {
      title: 'If you have previously registered a version(s) of your project with OSHWA, type in the UID for that project',
      contentfulFieldName: 'previousVersions',
      formPlaceholder: 'Enter the OSHWA UID of a previous version'
    }
  }
};

module.exports = {
  booleanDropdownContent,
  certificationMarkTermsContent,
  checkboxContent,
  checkboxesContent,
  textAreaContent,
  dropdownSelectContent,
  explanationTextAreaContent,
  inputContent,
  previousVersionsContent,
  urlInputsContent
};
