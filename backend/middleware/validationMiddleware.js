const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false }); // Validate all errors
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  next();
};

export default validate;
