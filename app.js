const express = require('express')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid');;

const fileSize = process.env.FILESIZE || Infinity

const files = 1
const abortOnLimit = true
const safeFileNames = true
const limits = { fileSize, files }
const options = { safeFileNames, limits, abortOnLimit }

function handleUpload(req, res, next) {
  const notProvided = new Error('File not provided')
  const invalidKey = new Error('Invalid key provided')
  if (!req.files || !req.files.data) throw notProvided
  // if (!req.query.key || !process.env['KEY_' + req.query.key]) throw invalidKey
  // req.files.data.mv(process.env['KEY_' + req.query.key] + "20210719", next)
  
  // const uuid = uuidv4();
  // req.files.data.mv('/uploads/' + uuid);

  const buffer = req.files.data.data;
  // console.log(req.files.data.size / 1024 / 1024);
  next();
}

function handleSuccess(req, res, next) {
  // console.log(`[${req.ip}] [201] Upload successful for ${req.query.key}`)
  console.log(`[${req.ip}] [201] Upload successful `)
  res.status(201).send('Upload successful') 
}

function handleInvalidRequests(req, res) {
  throw new Error('That request is not supported')
}

function handleError(err, req, res, next) {
  const code = 
    err.message == 'File not provided' || 
    err.message == 'Invalid key provided' ||
    err.message == 'That request is not supported' ? 400 : 500
  const response = code == 400 ? err.message : 'Could not process upload'
  console.log(`[${req.ip}] [${code}] Upload failed with: ${err.message}`)
  res.status(code).send(response)
}

const app = express()
app.use(fileUpload(options))
app.post('/upload', handleUpload)
app.post('/upload', handleSuccess)
app.all('*', handleInvalidRequests)
app.use(handleError)

module.exports = app
