# -*- coding: utf-8 -*-
from odoo import http

# print out the logger message
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__) 

class MyShop(http.Controller):
    @http.route(['/','/myshop/<path:route>'], auth='public')
    def index(self, **kw):
        return http.request.render('myshop.index', {})

    @http.route(['/my/categories/'], auth='public', type='json')
    def fetchData(self, **kw):
        logger.info('_______________start app_________________')
        Categories = http.request.env['myshop.mycategories']
        categories = Categories.search([])
        data = []
        for category in categories:
            row = {
                'id':category.id,
                'name':category.name,
                'image':category.image,
                'myproducts_ids':category.myproducts_ids,
                'products':[{
                    'id':x.id, 
                    'name':x.name,
                    'list_price':x.list_price, 
                    'image_1920':x.image_1920
                }for x in category.myproducts_ids]
            }
            data.append(row)
        return data