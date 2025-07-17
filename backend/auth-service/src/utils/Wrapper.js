const wrapper = (controllerFn) => {
  return async (req, res, next) => {
    return Promise.resolve(controllerFn(req, res, next)).catch((err) =>
      next(err)
    );
  };
};

export default wrapper;