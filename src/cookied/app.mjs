import express from 'express';
import { parseCookies, manageSession } from './cookied.mjs';
import colorOptions from './colors.mjs';

const app = express();

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

// TODO:
// implement the function, parseCookies, in cookied.mjs
// it should parse the incoming "Cookie" header
// into a property called hwCookies on the req object
app.use(parseCookies);

// TODO:
// implement the function, manageSession, in cookied.mjs
// it should either fetch the data associated with an
// incoming session id (based on parsed cookies from
// above) or generate a new session id and use
// Set-Cookie to create a cookie with that session id on
// the client side
app.use(manageSession);

app.get('/', function(req, res) {
    const favColor = req.hwSession.favColor || '#fff';
    res.render('index', {favColor:favColor, 'sessionData':JSON.stringify(req.hwSession, null, 2)});
});

app.get('/preferences', function(req, res) {
    const favColor = req.hwSession.favColor || '#fff';
    const options = colorOptions.map(function(c) {
        c.selected = c.hex === favColor; 
        return c;
    });
    res.render('preferences.hbs', {favColor:favColor, options: options});
});

app.post('/preferences', function(req, res) {
    req.hwSession.favColor = req.body.favColor;
    res.redirect('/preferences');
});

app.listen(process.env.PORT ?? 3000);
