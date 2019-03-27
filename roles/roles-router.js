const router = require('express').Router();
const knex = require('knex'); //install this and sqlite3

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/roles.db3'
  },
  debug: true, //only use in developmemt - shows sql that knex is executing in db on the server window
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
  //returns a promise that resolves to all records in the table
  db('roles')
  .then(roles => {
    res.status(200).json(roles);
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db('roles').where({ id })
  .first()  //returns single object instead of sqlite default of an array
  .then(role => {
    res.status(200).json(role);
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

router.post('/', (req, res) => {
  //get back an array with the last id generated in an array ex: [3]
  db('roles').insert(req.body)
  .then(ids => {
    const id = ids[0];
    db('roles').where({ id })
    .first()
    .then(role => {
      res.status(201).json(role);
    })
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

router.put('/:id', (req, res) => {
  db('roles').where({ id: req.params.id }).update(req.body)
  .then(count => {
    if(count > 0) {
      res.status(200).json(count);
    } else {
      res.status(404).json({ message: 'Record not found' })
    }
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

router.delete('/:id', (req, res) => {
  db('roles').where({id: req.params.id}).del()
  .then(count => {
    if(count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Record not found' })
    }
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

module.exports = router;
