'use strict';

var fs = require('fs-extra');
var _ = require('lodash');
var async = require('async');
var debug = require('debug')('kibana4-backup');
var config = require('../config');
var dump = require('./dump');

module.exports = deploy;

function deploy(cb) {
  debug('Looking in deploy directory for changes');
  async.waterfall([
    _.partial(fs.readdir, config.deployDir),
    rejectReadmeFiles,
    dumpAndRemove
  ], cb);
}

function rejectReadmeFiles(files, cb) {
  async.reject(files, fileIsReadme, function(result){
    cb(null, result);
  });
}

function fileIsReadme(file, cb) {
  cb(file === 'README.md');
}


function dumpAndRemove(files, cb) {
  async.series([
    _.partial(async.each, files, dump),
    _.partial(async.each, files, fs.remove)
  ], cb);
}