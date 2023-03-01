from sre_parse import CATEGORIES
from flask import Flask,request, render_template
import requests

app=Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/hello')
def hello():
    return "hello world!"

@app.route('/submit')
def submitForm():
    args = request.args
    keyword = args['aca-keyword']
    lat = args['aca-lat']
    long = args['aca-long']
    category = args['aca-categories']
    radius = int(float(args['aca-distance']) * 1609.3)

    yelpUrl = "https://api.yelp.com/v3/businesses/search?term={keyword}&latitude={lat}&longitude={long}&categories={category}&radius={radius}"
    headers = {"Authorization": "Bearer 09hkztyBdxQtTnP-HOMufKM7bZPfaCGpjXHrt8yxx9NFismvcRSD12jlzV2D1DS9A_mjXd9Y18m7_T8Hcy1je36oc3Y47p15D8Z6eEN-PiVxgmnmwOt-I3S9sJkoY3Yx"}

    res = requests.get(yelpUrl.format(keyword=keyword, lat=lat, long=long, category=category, radius=radius), headers=headers).json()

    businesses = []
    if res and 'businesses' in res.keys()  :
        for resBusiness in res['businesses'] :
            business = {}
            business['id'] = resBusiness['id']
            business['name'] = resBusiness['name']
            business['rating'] = resBusiness['rating']
            business['distance'] = round(resBusiness['distance'] * 0.0006214, 2)
            business['image'] = resBusiness['image_url']
            businesses.append(business)

    return {'businesses' : businesses}

@app.route('/business-detail/<id>')
def getBusinessDetail(id):
    yelpUrl = "https://api.yelp.com/v3/businesses/{id}"
    headers = {"Authorization": "Bearer 09hkztyBdxQtTnP-HOMufKM7bZPfaCGpjXHrt8yxx9NFismvcRSD12jlzV2D1DS9A_mjXd9Y18m7_T8Hcy1je36oc3Y47p15D8Z6eEN-PiVxgmnmwOt-I3S9sJkoY3Yx"}

    res = requests.get(yelpUrl.format(id=id), headers=headers).json()
    business = {}
    if res:
        keys = res.keys()
        if 'id' in keys:
            business['id'] = res['id']
        if 'name' in keys:
            business['name'] = res['name']
        if 'is_closed' in keys:
             if 'hours' in keys:
                hours = res['hours']
                business['status'] = 'Open now' if hours[0]["is_open_now"] else 'Closed'
                # business['status'] = 'Closed' if res['is_closed'] else 'Open now'
        if 'display_phone' in keys:
            business['phone'] = res['display_phone']
        if 'price' in keys:
            business['price'] = res['price']
        if 'url' in keys:
            business['more_info_link'] = res['url']
        if 'photos' in keys:
            business['photos'] = res['photos']
        if 'transactions' in keys:
            business['transactions'] = res['transactions']

        if 'categories' in keys and len(res['categories']) > 0:
            business['categories'] = [category['title'] for category in res['categories']]

        if 'location' in keys and res['location']['display_address']:
            business['address'] = ', '.join(res['location']['display_address'])


    return business


if __name__=="__main__":
    app.run(debug=True)
