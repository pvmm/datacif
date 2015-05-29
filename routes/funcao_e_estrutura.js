module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();

  router.get('/funcao_e_estrutura/:id', app.isLoggedIn, function(req, res) {
    res.render("funcao_e_estrutura", { id : req.params['id'] });
  });

  return router;
}