odoo.define('myshop.views', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var Router = require('myshop.router');

    var qweb = core.qweb;
    var bus = core.bus;

    publicWidget.registry.myshopViews = publicWidget.Widget.extend({
        selector: '#o_myshop_view',
        events: {
            'click .o_myshop_image': '_onClickImage',
            'click .js_check_product': '_onClickButton',
        },
        init: function (parent, options) {
            this._super.apply(this, arguments);
            this.category = null;
            this.product = null;
        },
        start: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function () {
                bus.on('selected_category', self, self._categoryHandler);
                bus.on('selected_product', self, self._productHandler);
                bus.on('output_cart', self, self._cartHandler);
            });
        },
        destory: function () {
            bus.off('selected_category', this, this._categoryHandler);
            bus.off('selected_product', this, this._productHandler);
            bus.off('output_cart', this, this._cartHandler);
        },
        _categoryHandler: function(event) {
            this.category = event;
            var $list = qweb.render("myshop.products", { widget: this });
            this.$el.html($list);
            $('#category_name').text(this.category.name);
        },
        _productHandler: function (event, index, name) {
            this.product = event;
            const value = {
                widget: event,
                decodeImage: this._decodeImage,
                index: index
            }
            var $list = qweb.render("myshop.product", value);
            this.$el.html($list);
            $('#category_name').text(name + " >> " + event.name);
        },
        _cartHandler: function (event) {
            var $list = qweb.render("myshop.cart", { widget: event, decodeImage: this._decodeImage });
            this.$el.html($list);
        },
        _decodeImage: function(image) {
            return "data:image/jpeg;base64," + image
        },
        _onClickImage: function (event) {
            const index = event.currentTarget.getAttribute("data-index");
            // const value = {
            //     widget: this.category.products[index],
            //     decodeImage: this._decodeImage,
            //     index: index
            // }
            // var $list = qweb.render("myshop.product", value);
            // this.$el.html($list);
            // $('#category_name').text(this.category.name + " >> " + this.category.products[index].name);
            Router.navigate(this.category.name + '/' + this.category.products[index].id);
        },
        _onClickButton: function (event) {
            
            if(this.category) {
                const index = event.currentTarget.getAttribute("data-index");
                bus.trigger('add_to_cart', this.category.products[index]);
            }
            else
                bus.trigger('add_to_cart', this.product);
        }
    });
});