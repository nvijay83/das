from flask import Flask, request, Response, render_template
from flask.ext import restful
import time
from post import getposts, addpost, getfeed, likepost, dislikepost,addmsg,getmsg
import operator
from Pubnub import Pubnub
import os
import bp_lib

app = Flask(__name__,template_folder='.',static_folder=')
api = restful.Api(app)

sub_key = 'sub-c-217854ce-0f94-11e4-9284-02ee2ddab7fe'
pub_key = 'pub-c-ef715ccb-68fa-4f79-98b8-8b7d48f35958'


pubnub = Pubnub(publish_key=pub_key, subscribe_key=sub_key)

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))

def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        # Figure out how flask returns static files
        # Tried:
        # - render_template
        # - send_file
        # This should not be so non-obvious
        return open(src).read()
    except IOError as exc:
        return str(exc)

class Order(restful.Resource):
    def put(self, cust_id):
        order = request.form['order']
        cust_name = request.form['name']
        address = request.form['address']
        #Call pubnub api
        pubnub.publish("das_res", {'name' : cust_name, 'order': order, 'address': address})


class Deliver(restful.Resource):
    def put(self, rest_id):
        cust_name = request.form['name']
        res_name = request.form['res_name']
        from_address = request.form['faddress']
        taddress = request.form['taddress']
        pubnub.publish("das_del", {'cname': cust_name, 'rname' : res_name, 'faddress': from_address, 'taddress' : taddress})
        pubnub.publish("das_cus", "Order ready for pickup")

class Pickedup(restful.Resource):
    def put(self):
        pubnub.publish("das_cus","Order picked up")

class Delivered(restful.Resource):
    def put(self):
        pubnub.publish("das_res", "Order id 1 delivered")



@app.route('/res', methods=['GET'])
def res():
    content = get_file('res.html')
    return Response(content, mimetype="text/html")

@app.route('/cus', methods=['GET'])
def cus():
    content = get_file('cus.html')
    import bp_lib
    res = bp_lib.bpCreateInvoice(123456, .0001, 'Order description',{'apiKey':'NxLDZG94wp42naChTzLmSBmDOBg6kE1NQ3yL2srANA'})
    url  = res['url']
    return render_template("cus.html", url=url)

@app.route('/del', methods=['GET'])
def deli():
    content = get_file('del.html')
    return Response(content, mimetype="text/html")

api.add_resource(Order, '/order/<int:cust_id>')
api.add_resource(Deliver, '/deliver/<int:rest_id>')
api.add_resource(Pickedup, '/pickedup')
api.add_resource(Delivered, '/delivered')

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
