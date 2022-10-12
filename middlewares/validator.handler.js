const boom = require('@hapi/boom');


//clousure
function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data);
    if (error) {
      next(boom.badRequestA(data));
    }
    next();
  }
}

module.exports = validatorHandler;
