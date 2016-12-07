const express = require('express');
const bodyParser= require('body-parser');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
// const upload = multer({ dest: 'public/img/' });
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node',
  multipleStatements: true
});

// Подключение к БД
db.connect(function(err) {
  if (err) { return console.log(err); }
  app.listen(3000, function() {
    console.log('localhost 3000');
  });
});

app.locals.auth = 0;

// Главная страница
app.get('/', function(req, res) {
  checkAuth( req.cookies.auth );
  db.query("SELECT * FROM museum; \
    SELECT text FROM about; \
    SELECT gallery.name, gallery.img, gallery.artist, gallery.alias, museum.name as 'm_name', museum.alias as 'm_alias' FROM gallery, museum WHERE gallery.m_id = museum.id LIMIT 3", 
    function(err, rows) {
      if (err) { return console.log(err); }
      res.render('index.ejs', {
        museum: rows[0],
        text: rows[1][0].text,
        gallery: rows[2]
      });
    });
});

// Все музеи
app.get('/museum/', function(req, res) {
  checkAuth( req.cookies.auth );
  db.query("SELECT * FROM museum", function(err, rows) {
    if (err) { return console.log(err); }
    res.render('museum.ejs', {
      museum: rows,
    });
  });
});

// Вся галерея
app.get('/gallery/', function(req, res) {
  checkAuth( req.cookies.auth );
  db.query("SELECT gallery.name, gallery.img, gallery.artist, gallery.alias, museum.name as 'm_name', museum.alias as 'm_alias' FROM gallery, museum WHERE gallery.m_id = museum.id", 
    function(err, rows) {
      if (err) { return console.log(err); }
      res.render('gallery.ejs', {
        gallery: rows,
      });
    });
});

// Музей
function getMuseum(req, res, next) {
  db.query('SELECT * FROM museum WHERE alias="'+req.params.alias+'"', function(err, rows) {
    if (err) { return console.log(err); }
    if ( rows[0] !== undefined ) {
      req.museum = rows[0];
    } else {
      res.status(404).send('<h1 align="center">ERROR 404<br>PAGE NOT FOUND<br><a href="/">На главную</a></h1>');
    }
    next();
  });
}
app.get('/museum/:alias', getMuseum, function(req, res) {
  checkAuth( req.cookies.auth );
  db.query('SELECT * FROM gallery WHERE m_id="'+req.museum.id+'"; \
    SELECT * FROM comments WHERE museum_gallery="1" AND p_id="'+req.museum.id+'" ORDER BY id DESC',
    function(err, rows) {
      if (err) { console.log(err); }
      res.render('museum-item.ejs', {
        museum: req.museum,
        gallery: rows[0],
        comments: rows[1]
      });
  });
});

// Картина
function getGallery(req, res, next) {
  db.query('SELECT * FROM gallery WHERE alias="'+req.params.alias+'"', function(err, rows) {
    if (err) { return console.log(err); }
    if ( rows[0] !== undefined ) {
      req.gallery = rows[0];
    } else {
      res.status(404).send('<h1 align="center">ERROR 404<br>PAGE NOT FOUND<br><a href="/">На главную</a></h1>');
    }
    next();
  });
}
app.get('/gallery/:alias', getGallery, function(req, res) {
  checkAuth( req.cookies.auth );
  db.query('SELECT * FROM museum WHERE id="'+req.gallery.m_id+'"; \
    SELECT * FROM comments WHERE museum_gallery="2" AND p_id="'+req.gallery.id+'" ORDER BY id DESC',
    function(err, rows) {
      if (err) { return console.log(err); }
      res.render('gallery-item.ejs', {
        gallery: req.gallery,
        museum: rows[0][0],
        comments: rows[1]
      });
  });
});

// Комментарии музея
app.post('/museum/:alias', function(req, res) {
  if ( req.body.c_msg ) {
    if ( !req.body.c_name ) {
      req.body.c_name = 'Anonymous';
    }
    var ins = {
      name: req.body.c_name,
      msg: req.body.c_msg.replace("\r\n", '<br>'),
      museum_gallery: req.body.museum_gallery,
      p_id: req.body.p_id
    };
    db.query('INSERT INTO comments SET ?', ins, function(err) {
      if (err) { return console.log(err); }
    });
  }
  res.redirect(req.get('referer') + '#c');
});

// Комментарии картины
app.post('/gallery/:alias', function(req, res) {
  if ( req.body.c_msg ) {
    if ( !req.body.c_name ) {
      req.body.c_name = 'Anonymous';
    }
    var ins = {
      name: req.body.c_name,
      msg: req.body.c_msg.replace("\r\n", '<br>'),
      museum_gallery: req.body.museum_gallery,
      p_id: req.body.p_id
    };
    db.query('INSERT INTO comments SET ?', ins, function(err) {
      if (err) { return console.log(err); }
    });
  }
  res.redirect(req.get('referer') + '#c');
});

// Покупка картины
app.get('/buy/', function(req, res) {
  checkAuth( req.cookies.auth );
  db.query('SELECT * FROM gallery WHERE id="' + req.query.id + '"', function(err, rows) {
    if (err) { return console.log(err); }
    res.render('buy.ejs', {
      gallery: rows[0],
    });
  });
});
app.post('/buy/', function(req, res) {
  if ( req.body.b_name && req.body.b_email && req.body.b_tel && req.body.b_addr ) {
    var ins = {
      b_id: req.body.b_id,
      b_name: req.body.b_name,
      b_email: req.body.b_email,
      b_tel: req.body.b_tel,
      b_addr: req.body.b_addr,
    };
    db.query('INSERT INTO orders SET ?', ins, function(err) {
      if (err) { return console.log(err); }
    });
    res.redirect('/buy/ok/');
  } else {
    res.redirect(req.get('referer'));
  }
});
app.get('/buy/ok/', function(req, res) {
  res.send('<h1 align="center">Ваш заказ успешно оформлен<br><a href="/">На главную</a></h1>');
});

// Вход/рег
app.get('/auth/', function(req, res) {
  res.render('auth.ejs');
});
app.post('/reg/', function(req, res) {
  if ( req.body.u_login && req.body.u_password1 && req.body.u_password2 && req.body.u_password1 === req.body.u_password2 ) {
    var ins = {
      login: req.body.u_login,
      password: req.body.u_password1,
    };
    db.query('INSERT INTO users SET ?', ins, function(err) {
      if (err) {
        console.log(err);
        res.redirect('/auth/');
      } else {
        res.redirect('/reg/ok/');
      }
    });
  } else {
    res.redirect(req.get('referer'));
  }
});
app.get('/reg/ok/', function(req, res) {
  res.send('<h1 align="center">Вы успешно зарегистрированы!<br><a href="/auth/">Вход</a><br><a href="/">На главную</a></h1>');
});
app.post('/log/', function(req, res) {
  if ( req.body.u_login && req.body.u_password ) {
    db.query('SELECT * FROM users WHERE login = ? AND password = ?', [req.body.u_login, req.body.u_password], function(err, rows) {
      if (err) { return console.log(err); }
      if ( rows[0] !== undefined ) {
        res.cookie('auth', rows[0].login, { expires: new Date(Date.now() + 60 * 60 * 1000) });
        app.locals.auth = rows[0].login;
        res.send('<h1 align="center">Вход выполнен успешно!<br><a href="/">На главную</a></h1>');
      } else {
        res.send('<h1 align="center">Неправильный логин или пароль.<br><a href="/auth/">Вход</a><br><a href="/">На главную</a></h1>');
      }
    });
  } else {
    res.redirect(req.get('referer'));
  }
});

// Выход
app.get('/exit/', function(req, res) {
  app.locals.auth = 0;
  res.clearCookie('auth');
  res.redirect('/');
});

// Админка
app.
get('/admin-login/', function(req, res) {
  res.render('admin-login.ejs');
}).
post('/admin-login/', function(req, res) {
  if ( req.body.admin_password === 'admin' ) {
    res.cookie('admin', 'admin');
    res.redirect('/admin/');
  } else {
    res.redirect(req.get('referer'));
  }
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + '.' + file.mimetype.split('/')[1])
  }
});
var upload = multer({ storage: storage });
var upload2 = multer({ storage: storage }).single('g_img');

app.
get('/admin/', function(req, res) {
  if ( req.cookies.admin !== undefined ) {
    db.query("SELECT * FROM gallery ORDER BY id DESC; SELECT id, name FROM museum;", function(err, rows) {
      if (err) {
        console.log(err);
        res.redirect('/admin/');
      }
      res.render('admin.ejs', {
        gallery: rows[0],
        museum: rows[1],
      });
    });
  } else {
    res.redirect('/admin-login/');
  }
}).
post('/admin/', upload.single('g_img'), function(req, res) {
  var ins = {
    name: req.body.g_name,
    img: req.file.filename,
    price: req.body.g_price,
    artist: req.body.g_artist,
    m_id: req.body.g_museum,
    alias: req.body.g_alias,
  };
  db.query('INSERT INTO gallery SET ?', ins, function(err) {
    if (err) { console.log(err); }
    res.redirect(req.get('referer'));
  });
}).
delete('/admin/', function(req, res) {
  db.query("DELETE FROM gallery WHERE id = ?", [req.body.id], function(err, rows) {
    if (err) {
      console.log(err);
      res.redirect('/admin/');
    }
    res.send('ok');
  });
});
app.post('/admin-upd/', function(req, res) {
  upload2(req, res, function(err) {
    if ( req.file === undefined ) {
      var ins = {
        id: req.body.g_id,
        name: req.body.g_name,
        price: req.body.g_price,
        artist: req.body.g_artist,
        m_id: req.body.g_museum,
        alias: req.body.g_alias,
      };
    } else {
      var ins = {
        id: req.body.g_id,
        name: req.body.g_name,
        img: req.file.filename,
        price: req.body.g_price,
        artist: req.body.g_artist,
        m_id: req.body.g_museum,
        alias: req.body.g_alias,
      };
    }
    db.query('UPDATE gallery SET ? WHERE id = ? ', [ins, req.body.g_id], function(err) {
      if (err) { console.log(err); }
      res.redirect(req.get('referer'));
    });
  });
});

// Страница 404
app.get('*', function(req, res){
  res.status(404).send('<h1 align="center">ERROR 404<br>PAGE NOT FOUND<br><a href="/">На главную</a></h1>');
});

// Проверка авторизации
function checkAuth(username) {
  if ( username !== undefined ) {
    app.locals.auth = username;
  }
};
