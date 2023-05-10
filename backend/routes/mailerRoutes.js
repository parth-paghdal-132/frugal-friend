const express = require('express');
const mailer = require('../data/mailerData');
const bodyParser = require('body-parser');

const router = express.Router();

const jsonParser = bodyParser.json({limit: '500mb'});
const urlEncoder = bodyParser.urlencoded({limit: '500mb', extended: true, parameterLimit: 50000});

router.post('/email/monthly', jsonParser, urlEncoder, async (req, res) => {
  let errors = {}

  if (!req.session.user) {
    errors.other = "Please login into app to email budget"
    errors.sessionExpired = true
    errors.code = 403
    return res.status(403).json(errors)
  }

  if (!req.body.month) {
    return res.status(400).json({error: 'month needs to be supplied'})
  }

  if (!req.body.expense) {
    return res.status(400).json({error: 'expense needs to be supplied'})
  }

  if (!req.body.chartUrl) {
    return res.status(400).json({error: 'chartUrl needs to be supplied'})
  }

  try {
    await mailer.sendEmail(req.session.user.email, req.body.month, req.body.expense, req.body.chartUrl);
    return res.status(201).json({created: true});
  } catch (e) {
    return res.status(500).json({create: false});
  }
});

module.exports = router;