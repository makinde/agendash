'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = agendash => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use('/', express.static(path.join(__dirname, '../../public')));

  app.get('/api', (request, res) => {
    agendash.api(request.query.job, request.query.state, (err, apiResponse) => {
      if (err) {
        return res.status(400).json(err);
      }

      res.json(apiResponse);
    });
  });

  app.post('/api/jobs/requeue', (request, res) => {
    agendash.requeueJobs(request.body.jobIds, (err, newJobs) => {
      if (err || !newJobs) {
        return res.status(404).json(err);
      }

      res.json(newJobs);
    });
  });

  app.post('/api/jobs/delete', (request, res) => {
    agendash.deleteJobs(request.body.jobIds, err => {
      if (err) {
        return res.status(404).json(err);
      }

      return res.json({deleted: true});
    });
  });

  app.post('/api/jobs/create', (request, res) => {
    agendash.createJob(request.body.jobName, request.body.jobSchedule, request.body.jobRepeatEvery, request.body.jobData, err => {
      if (err) {
        return res.status(404).json(err);
      }

      return res.json({created: true});
    });
  });

  return app;
};
