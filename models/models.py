# -*- coding: utf-8 -*-

from odoo import models, fields, api

class MyCategories(models.Model):
    _name = 'myshop.mycategories'
    _inherit = ['mail.thread','mail.activity.mixin']

    name = fields.Char()
    image = fields.Binary(string='Image', attachment=True)
    myproducts_ids = fields.One2many('product.template', 'mycategories_id', string="MyProducts")

class MyProducts(models.Model):
    _inherit = ['product.template']

    mycategories_id = fields.Many2one('myshop.mycategories', string="MyCategories")

#     name = fields.Char()
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
