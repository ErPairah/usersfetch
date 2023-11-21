var express = require('express');
var router = express.Router();
const mongojs = require('mongojs')
const db = mongojs('bezeroakdb', ['bezeroak'])

/*let users = [
  { izena: "John", abizena: "Doe", email: "john@doe.com"},
];*/
let users = [];

db.bezeroak.find( function (err, docs) {
  if(err){
    console.log(err)
  }else{
   users = docs;
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
        res.render('users', {
            'title': 'EJS probatzen',
        })
});

router.get('/list', function(req, res, next) {
  db.bezeroak.find( function (err, docs) {
    res.json(docs);
})
  });


router.post("/new", (req, res) => {
  users.push(req.body);
  let bezeroBerria = {
    izena: req.body.izena,
    abizena: req.body.abizena,
    email: req.body.email
  }

    db.bezeroak.insert( bezeroBerria, function(err, doc){
        if(err){
            console.log(err)
        } else {
            res.json(doc)
        }
    } );

});

router.delete("/delete/:id", (req, res) => {
  users = users.filter(user => user.id != req.params.id);
  db.bezeroak.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, doc){
    if(err){
        console.log(err)
    } else {
        console.log(users)
    }
  });
  res.json(users); // necesita un envio porque sino se queda cargando
});

router.put("/update/:id", (req, res) => {
  let user = users.find(user => user._id == req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;
  
  db.bezeroak.update({_id: mongojs.ObjectId(req.params.id)},{$set: {izena:req.body.izena, abizena: req.body.abizena, email: req.body.email}}, function(err, doc){
    if(err){
        console.log(err)
    } else {
        console.log(doc)
    }
  });
})

module.exports = router;
