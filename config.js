"use strict";

// exports.DATABASE_URL =
//   process.env.DATABASE_URL || "mongodb://localhost/backpacking-app";

exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://asiede:SashaB00ne@ds155862.mlab.com:55862/backpacking-app";



// exports.TEST_DATABASE_URL =
//   process.env.TEST_DATABASE_URL || "mongodb://localhost/test-backpacking-app";

exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://asiede:SashaB00ne@ds245210.mlab.com:45210/test-backpacking-app";


exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';