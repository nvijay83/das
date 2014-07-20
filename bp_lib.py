"""
The MIT License (MIT)

Copyright (c) 2011-2014 BitPay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""

import bp_options
import os
import time
import json
import base64
from hashlib import sha256
import hmac
import binascii
import urllib2
import urllib

#print bp_options.bpOptions

def bpLog(contents):
    """
    Writes contents to a log file specified in the bp_options file or, if missing,
    defaults to a standard filename of 'bplog.txt'.
    
    @param mixed contents
    @return
    """
    if bp_options.bpOptions['logFile'] != "":
        file = os.path.realpath(__file__) + bp_options.bpOptions['logFile']
    else:
        # Fallback to using a default logfile name in case the variable is
        # missing or not set.
        file = os.path.realpath(__file__) + '/bplog.txt'
        
    with open(file, "a") as log_file:
        log_file.write(time.strftime('%m-%d %H:%M:%S') + ": ")
        log_file.write(json.dumps(contents) + "\n")

def bpCurl(url, apiKey, post = False):
    global response
    """
    Handles post/get to BitPay via curl.
    
    @param string url, string apiKey, boolean post
    @return mixed response
    """
    response = ""
    if url.strip() != '' and apiKey.strip() != '':
    
        cookie_handler= urllib2.HTTPCookieProcessor()
        redirect_handler= urllib2.HTTPRedirectHandler()
        opener = urllib2.build_opener(redirect_handler, cookie_handler)

        uname = base64.b64encode(apiKey)

        opener.addheaders = [
            ('Content-Type', 'application/json'),
            ('Authorization', 'Basic ' + uname),
            ('X-BitPay-Plugin-Info', 'pythonlib1.1'),
        ] 

        if post:
            responseString = opener.open(url, urllib.urlencode(json.loads(post))).read()
        else:
            responseString = opener.open(url).read()

        try:
            response = json.loads(responseString)
        except ValueError:
            response = {
                "error": responseString
            }
            if bp_options.bpOptions['useLogging']:
                bpLog('Error: ' . responseString)
                
    return response


def bpCreateInvoice(orderId, price, posData, options = {}):
    """
        Creates BitPay invoice via bpCurl.
        
        @param string orderId, string price, string posData, array options
        @return array response
    """
    # orderId: Used to display an orderID to the buyer. In the account summary view, this value is used to
    # identify a ledger entry if present. Maximum length is 100 characters.
    #
    # price: by default, price is expressed in the currency you set in bp_options.php.  The currency can be
    # changed in options.
    #
    # posData: this field is included in status updates or requests to get an invoice.  It is intended to be used by
    # the merchant to uniquely identify an order associated with an invoice in their system.  Aside from that, Bit-Pay does
    # not use the data in this field.  The data in this field can be anything that is meaningful to the merchant.
    # Maximum length is 100 characters.
    #
    # Note:  Using the posData hash option will APPEND the hash to the posData field and could push you over the 100
    #        character limit.
    #
    #
    # options keys can include any of:
    #	'itemDesc', 'itemCode', 'notificationEmail', 'notificationURL', 'redirectURL', 'apiKey'
    #	'currency', 'physical', 'fullNotifications', 'transactionSpeed', 'buyerName',
    #	'buyerAddress1', 'buyerAddress2', 'buyerCity', 'buyerState', 'buyerZip', 'buyerEmail', 'buyerPhone'
    #
    # If a given option is not provided here, the value of that option will default to what is found in bp_options.php
    # (see api documentation for information on these options).

    options = dict(bp_options.bpOptions.items() + options.items()) # options override any options found in bp_options.php
    pos = {
        "posData": posData
    }

    if bp_options.bpOptions['verifyPos']:
        pos['hash'] = bpHash(str(posData), options['apiKey']);

    options['posData'] = json.dumps(pos);

    if len(options['posData']) > 100:
        return {
            "error": "posData > 100 character limit. Are you using the posData hash?"
        }

    options['orderID'] = orderId;
    options['price'] = price;

    postOptions = ['orderID', 'itemDesc', 'itemCode', 'notificationEmail', 'notificationURL', 'redirectURL', 
                         'posData', 'price', 'currency', 'physical', 'fullNotifications', 'transactionSpeed', 'buyerName', 
                         'buyerAddress1', 'buyerAddress2', 'buyerCity', 'buyerState', 'buyerZip', 'buyerEmail', 'buyerPhone'];
           
    """                       
    postOptions = ['orderID', 'itemDesc', 'itemCode', 'notificationEmail', 'notificationURL', 'redirectURL', 
                         'posData', 'price', 'currency', 'physical', 'fullNotifications', 'transactionSpeed', 'buyerName', 
                         'buyerAddress1', 'buyerAddress2', 'buyerCity', 'buyerState', 'buyerZip', 'buyerEmail', 'buyerPhone',
                         'pluginName', 'pluginVersion', 'serverInfo', 'serverVersion', 'addPluginInfo'];
    """
    # Usage information for support purposes. Do not modify.
    #postOptions['pluginName']    = 'Python Library';
    #postOptions['pluginVersion'] = '1.0';
    #postOptions['serverInfo']    = htmlentities(_SERVER['SERVER_SIGNATURE'], ENT_QUOTES);
    #postOptions['serverVersion'] = htmlentities(_SERVER['SERVER_SOFTWARE'], ENT_QUOTES);
    #postOptions['addPluginInfo'] = htmlentities(_SERVER['SCRIPT_FILENAME'], ENT_QUOTES);

    for o in postOptions:
        if o in options:
            pos[o] = options[o]

    pos = json.dumps(pos);

    response = bpCurl('https://bitpay.com/api/invoice/', options['apiKey'], pos);

    if bp_options.bpOptions['useLogging']:
        bpLog('Create Invoice: ')
        bpLog(pos)
        bpLog('Response: ')
        bpLog(response)

    return response

def bpVerifyNotification(apiKey = False):
    """
    Call from your notification handler to convert _POST data to an object containing invoice data
    
    @param boolean apiKey
    @return mixed json
    """

    if not apiKey:
        apiKey = bp_options.bpOptions['apiKey']	

    post = {} #how you get this post body data depends on what HTTP server you are using - SimpleHTTPServer, Flask, Bottle, Django, etc.

    if not post:
        return 'No post data'

    jsondata = json.loads(post)

    if 'posData' not in jsondata:
      return 'no posData'

    posData = json.loads(jsondata['posData'])

    if bp_options.bpOptions['verifyPos'] and posData['hash'] != bpHash(str(posData['posData']), apiKey):
        return 'authentication failed (bad hash)'

    jsondata['posData'] = posData['posData']

    return jsondata

def bpGetInvoice(invoiceId, apiKey=False):
    """
    Retrieves an invoice from BitPay.  options can include 'apiKey'
    
    @param string invoiceId, boolean apiKey
    @return mixed json
    """

    if not apiKey:
      apiKey = bp_options.bpOptions['apiKey']

    response = bpCurl('https://bitpay.com/api/invoice/'+invoiceId, apiKey)

    response['posData'] = json.loads(response['posData'])
    response['posData'] = response['posData']['posData']

    return response

def bpHash(data, key):
    """
    Generates a base64 encoded keyed hash.
    
    @param string data, string key
    @return string hmac
    """
    
    hashed = hmac.new(key, data, sha256)
    return binascii.b2a_base64(hashed.digest())[:-1]

def bpDecodeResponse(response):
    """
    Decodes JSON response and returns
    associative array.
    
    @param string response
    @return array arrResponse
    """
  
    if response == "" or response is None:
      return 'Error: decodeResponse expects a string parameter.';

    return json.loads(response)
