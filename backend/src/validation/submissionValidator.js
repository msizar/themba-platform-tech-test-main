import { checkSchema, validationResult } from 'express-validator';

const submissionValidationSchema = {
  name: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Name is required',
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'Name must be between 2 and 100 characters',
    },
  },
  message: {
    in: ['body'],
    trim: true,
    notEmpty: {
      errorMessage: 'Description is required',
    },
    isLength: {
      options: { min: 10, max: 1000 },
      errorMessage: 'Description must be between 10 and 1000 characters',
    },
  },
  'file.data': {
    in: ['body'],
    notEmpty: {
      errorMessage: 'File is required',
    },
  },
  'file.name': {
    in: ['body'],
    optional: true,
    matches: {
      options: [/^[a-zA-Z0-9._\-\s]+$/],
      errorMessage: 'File name contains invalid characters',
    },
  },
};

export const submissionValidationRules = checkSchema(submissionValidationSchema);

const formatValidationErrors = (errorsArray) => {
  const formattedErrors = {};

  errorsArray.forEach(({ path, msg }) => {
    const key = path.startsWith('file.') ? 'file' : path;

    if (!formattedErrors[key]) {
      formattedErrors[key] = msg;
    }
  });

  return formattedErrors;
};

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: formatValidationErrors(errors.array()) });
};

export const validateSubmissionPayload = async (payload) => {
  const req = { body: payload };

  await Promise.all(submissionValidationRules.map((rule) => rule.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return {};
  }

  return formatValidationErrors(errors.array());
};
