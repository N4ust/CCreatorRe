const mongoose = require('mongoose');
var Schema = new mongoose.Schema({
    nicknames: Array,
    urls: Array,
    Commandes: Array,
    Tab: Array,
    SubMessage: Array,
    Allow: Array,
    RoleCount: Number,
    prefix: String,
    Role: String,
    GuildID: String,
});
var Model = new mongoose.model('blbl', Schema);


module.exports = {
    init: () => {
        const dbOptions = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4,
        };

        mongoose.connect('mongodb://localhost:27017/Database', dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useUnifiedTopology',true);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Successfully connected !');
        });
        mongoose.connection.on('error', err => {
            console.log('Error');
            console.log(err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected');

        });


    },
    sauve: (a, b, c, d, e, f, g, h, i, j) => {
        var Server = new Model();
        Server.nicknames = a;
        Server.urls = b;
        Server.Commandes = c;
        Server.Tab = d;
        Server.SubMessage = e;
        Server.Allow = f;
        Server.RoleCount = g;
        Server.prefix = h;
        Server.Role = i;
        Server.GuildID = j;

        Server.save(function (err) {
            if (err) { throw err }
            console.log('Success !');
        })
    },
    test: x => {
        return new Promise((resolve) => {
            comparaison = false;
            var query = Model.find(null);
            query.exec(function fonction(err, c) {
                if (err) { throw console.log(err) }

                if (c.length > 0) {
                    for (let i = 0; i < c.length; i++) {
                        if (c[i].GuildID === x) {
                            comparaison = true;
                            return resolve(comparaison);
                        }
                        if (c[i].GuildID !== x && i === c.length - 1) {
                            return resolve(comparaison);
                        }
                    }
                }

                if (c[0] === undefined) {
                    return resolve(comparaison);
                }
            })
        })
    },
    data: (x) => {
        return new Promise((resolve) => {
            const array = new Map();
            var query = Model.findOne({ GuildID: x});
            query.exec((err, c) => {
                if (err) {
                    throw console.log(err);
                }
                ;
                array.set('nicknames', c.nicknames);
                array.set('urls', c.urls);
                array.set('Commandes', c.Commandes);
                array.set('Tab', c.Tab);
                array.set('SubMessage', c.SubMessage);
                array.set('Allow', c.Allow);
                array.set('Role', c.Role);
                array.set('RoleCount', c.RoleCount);
                array.set('prefix', c.prefix);
                return resolve(array);
            });
        });
    },
    update: (x, a, b, c, d, e, f, g, h, i) => {
       Model.updateOne({ GuildID: x }, {
            nicknames: a,
            urls: b,
            Commandes: c,
            Tab: d,
            SubMessage: e,
            Allow: f,
            RoleCount: g,
            prefix: h,
            Role: i
        }, function (err) {if(err) {console.log(err) }});
    }
}
