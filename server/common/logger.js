const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
/* interal dependencies */
const config = require("./config");

const options = {
  level: config.log_level || "info",
  handleExceptions: true,
  json: true,
  colorize: true,
};

const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [new transports.Console()],
});

logger.add(
  new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  })
);

module.exports = logger;
