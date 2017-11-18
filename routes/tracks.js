// LIBRARIES
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const uuid = require('node-uuid');
// OVERHEAD
const router = express.Router();
const s3 = new AWS.S3();
// ESSENTIAL
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

/**
 * listen for post requests (i.e. /tracks/) and submit the received user
 * recording (blob) to S3
 */
router.post('/', upload.single('file'), (request, response) => {
  const keyName = `recording-${uuid.v4()}.ogg`;
  const file = request.file; // file passed from client

  const params = {
    Bucket: 'voices-entwined',
    Key: keyName,
    Body: file.buffer,
    ACL: 'public-read',
  };

  s3.putObject(params, function (err, data) {
    if (err) {
      response.status(500).json(err);
    } else {
      response.status(200).json(data);
    }
  });
});

/**
 * listen for GET requests
 */
router.get('/', function (req, res) {

  const params = {
    Bucket: 'voices-entwined',
  };

  s3.listObjectsV2(params, (err, data) => {
    "use strict";
    if (err) {
      res.status(500).send(err);
    } else {
      let contents = data.Contents;
      res.status(200).send(getObjectFromContents(contents));
    }
  });
});

/**
 * choose some random file from the provided 'contents' array
 * @param contents (array)
 * @returns {Promise}
 */
function getObjectFromContents(contents) {
  "use strict";

  const min = 0;
  const max = contents.length;
  const index = randomBetween(min, max);
  const key = contents[index].Key;

  return `https://voices-entwined.s3.amazonaws.com/${key}`;
}

function randomBetween(min, max) {
  "use strict";
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = router;