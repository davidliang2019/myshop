odoo.define('myshop.categories', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var rpc = require("web.rpc");
    var Router = require('myshop.router');

    var _t = core._t;
    var qweb = core.qweb;
    var bus = core.bus;

    publicWidget.registry.myshopCategories = publicWidget.Widget.extend({
        selector: '#o_myshop_menu',
        xmlDependencies: ['/myshop/static/src/xml/myshop.xml'],
        events: {
            'click .w3-button': '_onClick',
        },
        init: function (parent, options) {
            this._super.apply(this, arguments);
            this.categories = [];
            Router.config({ mode: 'history', root:'myshop'});
        },
        willStart: function () {
            var self = this;
            return $.when(
                this._super.apply(this, arguments),
                this._fetchData(),
                // console.log(decodeURI(location.pathname + location.search))
            )
            .then(function() {
                self._addRouter();
            });
        },
        start: function () {
            this._displayList();
            return this._super.apply(this, arguments)
            .then(function() {
                Router.check();
            })
        },
        _fetchData: function () {
            var self = this;
            return rpc.query({
                route: '/my/categories',
                params: {
                },
            }).then(function (data) {
                self.categories = data;
                self.do_notify(
                    _t("fetch data successfully"),
                    _t('it is going to output the data')
                );
            });
        },
        _addRouter: function() {
            _.each(this.categories, function(category) {
                Router.add(category.name, function() {
                    bus.trigger('selected_category', category);
                });
                _.each(category.products, function(product, index) {
                    Router.add(category.name + '/' + product.id, function() {
                        bus.trigger('selected_product', product, index, category.name);
                    });
                });
            });
            Router.listen();
        },
        _displayList: function () {
            var $list = qweb.render("myshop.categories", { widget: this });
            this.$el.html($list);
        },
        _onClick: function (event) {
            event.preventDefault();
            const index = event.currentTarget.getAttribute("data-index");
            Router.navigate(this.categories[index].name);
        }
    });
});