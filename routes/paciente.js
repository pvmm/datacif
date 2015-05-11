module.exports = function(app, passport) {
  var express   = require('express');
  var router    = express.Router();
  var ObjectId  = require("mongolian").ObjectId;

  router.get('/', app.isLoggedIn, function(req, res) {
    res.location("/paciente/lista");
    res.redirect("/paciente/lista");
  });

  router.get('/lista', app.isLoggedIn, function(req, res) {
    console.log("123");
    var db = req.db;
    var pacientes = db.collection('pacientes');
    pacientes.find().sort({ 'nome' : 1 }).toArray(function(err, item) {
      console.log("456");

      if (err) {
        res.send("Erro ao tentar listar pacientes");
      }

      res.render('pacientes', {
        title : 'Lista de todos os pacientes',
        pacientes : item
      });
    });
  });

  router.get('/edita/:id', app.isLoggedIn, function(req, res) {
    var id = req.params['id'];
    var db = req.db;
    var pacientes = db.collection('pacientes');

    // pacientes.findOne({ _id: id }, {}, function(err, item) {
    pacientes.findOne({ _id: new ObjectId(id) }, function(err, item) {
      if (err) {
        res.send("Erro ao tentar editar um paciente");
      } else if (item) {
        var queryResult = {
          title : "Edita paciente",
          _id : item._id,
          nome : item.nome,
          dataNascimento : item.dataNascimento,
          sexo : item.sexo == 'm' ? true : false,
          cpf : item.cpf,
          logradouro : item.endereco.logradouro,
          complemento : item.endereco.complemento,
          bairro : item.endereco.bairro,
          cep : item.endereco.cep,
          registros : item.registros,
          morbidades : item.morbidades,
          address : '/paciente/altera'
        };

        console.log("[edt]paciente = ", queryResult);
        res.render('paciente', queryResult);
      } else {
        res.send({});
      }
    });
  });

  router.get('/novo', app.isLoggedIn, function(req, res) {
    res.render('paciente', {
      title : 'Adiciona novo paciente',
      _id : '',
      nome : '',
      dataNascimento : '',
      sexo : '',
      cpf : '',
      logradouro : '',
      complemento : '',
      bairro : '',
      cep : '',
      morbidades : [],
      address : '/paciente/adiciona'
    });
  });

  router.post('/adiciona', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var values = req.body.registros.slice(1, req.body.registros.length);
    var labels = req.body.tiposRegistro.slice(1, req.body.tiposRegistro.length);
    var registros = [];

    values.forEach(function(value, i) {
      registros.push({ nome: labels[i], valor: value });
    });

    var paciente = {
      nome : req.body.nome,
      dataNascimento : req.body.dataNascimento,
      sexo : req.body.sexo,
      cpf : req.body.cpf,
      registros : registros,
      morbidades : req.body.morbidades.slice(1, req.body.morbidades.length)
    };

    var endereco = {
      logradouro : req.body.logradouro,
      complemento : req.body.complemento,
      bairro : req.body.bairro,
      cep : req.body.cep
    };

    paciente.endereco = endereco;
    console.log("[add]paciente = ", paciente);

    var pacientes = db.collection('pacientes');
    pacientes.insert(paciente, function(err, doc) {
      if (err) {
        res.send("Erro ao tentar inserir um novo paciente");
      } else {
        res.location("/paciente/lista");
        res.redirect("/paciente/lista");
      }
    })
  });

  router.post('/altera', app.isLoggedIn, function(req, res) {
    var db = req.db;
    var id = new ObjectId(req.body._id);

    var values = req.body.registros.slice(1, req.body.registros.length);
    var labels = req.body.tiposRegistro.slice(1, req.body.tiposRegistro.length);
    var registros = [];

    values.forEach(function(value, i) {
      registros.push({ nome: labels[i], valor: value });
    });

    var paciente = {
      nome : req.body.nome,
      dataNascimento : req.body.dataNascimento,
      sexo : req.body.sexo,
      cpf : req.body.cpf,
      registros : registros,
      morbidades : req.body.morbidades.slice(1, req.body.morbidades.length)
    };

    var endereco = {
      logradouro : req.body.logradouro,
      complemento : req.body.complemento,
      bairro : req.body.bairro,
      cep : req.body.cep
    };

    paciente.endereco = endereco;
    console.log("[alt]paciente = ", paciente);

    var pacientes = db.collection('pacientes');
    pacientes.update({ _id: id }, paciente,
      function(err, doc) {
        if (err) {
          res.send("Erro ao tentar alterar um paciente");
        } else {
          res.location("/paciente/lista");
          res.redirect("/paciente/lista");
        }
      });
  });

  return router;
};
