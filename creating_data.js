var models = require('./app/basis/models');

models.Lang.create({
    addr: 'ru',
    name: 'Русский'
});
models.Lang.create({
    addr: 'en',
    name: 'English'
});

models.Board.create({
    addr: 'b',
    names: {
        ru: 'Разное',
        en: 'Other'
    }
});
models.Board.create({
    addr: 's',
    names: {
        ru: 'Отношения',
        en: 'Relationship'
    }
});