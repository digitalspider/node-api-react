const common = {

  // List of messages
  message: {
    // General
    serverError: 'An internal error has occured. Please contact sysadmin.',
    serverErrorTitle: 'Internal Error',
    errorHeader: 'Error',
    Unauthorized: 'The user session is expired/invalid. Please authenticate.',
    requiredField: 'Field is required',
    successHeader: 'Success',
    validationHeader: 'Validation Error',
    validationArticleHeader: 'Validation Error (Article Header)',
    validationMessage:
      'It seems that the form has got some validation errors.'
      + ' Please verify.',
    sessionExpiredTitle: 'Invalid User Session',
    sessionExpired:
      'It seems that the user session is no longer valid or has expired.'
      + ' Please login.',
    fileUploadMessage: 'File uploaded.',
    folderUploadMessage: 'Folder Created.',
  },

  datePicker: {
    format: 'DD/MM/YYYY',
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    placeholder: 'DD/MM/YYYY',
  },
  date: {
    formats: {
      apiPost: 'YYYY-MM-DD',
      display: 'DD/MM/YYYY',
      displayDateTime: 'DD/MM/YYYY HH:mm',
      displayDateTime2: 'DD MMM YYYY, HH:mm',
    },
  },
};

export default common;
