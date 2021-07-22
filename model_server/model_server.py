#!/usr/bin/python
from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi
import json

import pandas as pd
import numpy as np

PORT_NUMBER = 8080


import model


#This class will handles any incoming request from
#the browser
class myHandler(BaseHTTPRequestHandler):

	#Handler for the POST requests
	def do_POST(self):
		content_length = int(self.headers['Content-Length'])
		post_data = self.rfile.read(content_length)
		data = json.loads(post_data)
		df = pd.DataFrame(data)
		print(model.windowing(df))
		result = model.classifier.predict(np.array(model.windowing(df)).reshape(1, -1))[0]; print(model.class_names[result]);
		self.send_response(200)
		self.end_headers()
		self.wfile.write(model.class_names[result].encode('utf-8'))
		return


try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print('Started httpserver on port ' , PORT_NUMBER)

	#Wait forever for incoming htto requests
	server.serve_forever()

except KeyboardInterrupt:
	print('^C received, shutting down the web server')
	server.socket.close()


