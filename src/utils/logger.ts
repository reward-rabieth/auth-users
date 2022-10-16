import pino from "pino";

 const logger = pino({
  redact: ["hostname"],
  transport:{
    target:"pino-pretty"

  },
  timestamp() {
    return `, ${new Date().toISOString()}`;
  },
});

export default logger;
