export default class ApplicationError extends Error {
  constructor(msg, code) {
    super();
    this.msg = msg;
    this.code = code;
  }
}

// Middleware for handling error
export const ErrorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.msg);
  }

  res.status(500).render({ msg: "Oops! Something went Wrong" });
};
