exports.to = async (promise) => {
  return promise
    .then((data) => [null, data])
    .catch(err => {
      return [err, undefined];
    });
};

exports.successResponse = (data) => ({
  status: 'SUCCESS',
  data,
});

exports.errorResponse = (error) => ({
  status: 'FAILED',
  error,
});