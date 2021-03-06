# -*- coding: utf-8 -*-

import io
import base64
import pyqrcode
from tornado.gen import coroutine
from conf.settings import log, IMAGE_DOMAIN, IMG_CACHE_URL
from base import AuthHandler
from util.helper import error, ErrorCode, mongo_uid, gen_orderno


class DetailHandler(AuthHandler):
    @coroutine
    def get(self):
        try:
            recom_item_id = int(self.get_argument('id'))
        except Exception as e:
            log.error(e)
            self.write(error(ErrorCode.PARAMERR))
            return

        try:
            recom_item = yield self.db['youcai'].recom_item.find_one({'id': recom_item_id}, {'_id': 0})
            if recom_item:
                if IMG_CACHE_URL:
                    recom_item['imgs'] = list(map(lambda x: IMG_CACHE_URL + x[len(IMAGE_DOMAIN):] if x.startswith(IMAGE_DOMAIN) else x, recom_item['imgs']))

                recom_item['descr'] = recom_item['descr'].replace('\n', '<br/>')
                recom_item['detail']['content'] = recom_item['detail']['content'].replace('\n', '<br/>')

                buffer = io.BytesIO()
                url = pyqrcode.create(self.request.protocol + '://' + self.request.host + '/#!/recomitem/' + str(recom_item_id))
                url.png(buffer, scale=5, quiet_zone=0)
                qrcode = base64.encodebytes(buffer.getvalue()).decode().replace('\n', '')

                recom_item['qrcode'] = qrcode
                return self.write(recom_item)
            else:
                return self.write(error(ErrorCode.NODATA))
        except Exception as e:
            log.error(e)
            self.write(error(ErrorCode.DATAERR))
            return
