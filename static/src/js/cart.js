odoo.define('myshop.cart', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var bus = core.bus;

    publicWidget.registry.myshopPopover = publicWidget.Widget.extend({
        selector: '#o_myshop_cart',
        events: {
            'click': '_onClick',
        },
        init: function () {
            this._super.apply(this, arguments);
            this.cartList = [];
            this.NumberOfItem = 0;
        },
        start: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function () {
                bus.on('add_to_cart', self, self._productHandler);
                
            });
        },
        destory: function () {
            bus.off('add_to_cart', self, self._productHandler);
        },
        _productHandler: function (event) {
            if (this.cartList.length == 0)
                this.cartList = [{
                    product: event,
                    quanlity: 1
                }];
            else {
                var index = this.cartList.findIndex(k => k.product == event)
                if (index == -1)
                    this.cartList = [...this.cartList, {
                        product: event,
                        quanlity: 1
                    }];
                else
                    this.cartList[index].quanlity ++;
            }
            this.NumberOfItem ++;
            this.$el.removeClass('w3-margin-right');
            $('#o_badge').text(this.NumberOfItem);
        },
        _onClick: function (event) {
            bus.trigger('output_cart', this.cartList);
        },
    });
});