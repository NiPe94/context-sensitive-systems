# Context sensitive Systems Lecture - Exercise
This is the exercise for the Context sensitive systems Lecture at Karlsruher Institute for Technology.
You can find the application here: https://jennymuenk.github.io/kss-exercise.
Please use your smartphone!

    │
    ├── public                                
    │   ├── index.html                    <- app that uses context
    │   ├── training.html               <- collect context data
    │   └── classifier.js               <- model imported from python to javascript   
    │   
    ├── .gitignore 
    ├── data.csv           <- dump of the data used for training
    ├── exercises.ipynb    <- exercises 1 - 7 
    ├── packages.json     
    ├── packages-lock.json 
    ├── README.md 
    ├── requirements.txt   <- requirements for jupyter
    └── server.js          <- node server

--------

## Getting Started
Start Docker Container for influx:
```
 docker run -p 8086:8086 -v influxdb:/var/lib/influxdb influxdb
```

Start Node Server:
```
npm start

```

Start Jupyter notebook:
```
jupyter notebook
```

Start Python server:
```
python3 model_server/model_server.py
```

## InfluxDB 
Create training:
```
curl -G http://localhost:8086/query --data-urlencode "q=CREATE DATABASE training"
```

Get databases:
```
curl -G http://localhost:8086/query --data-urlencode "q=SHOW DATABASES"
```

Inserting into DB:
```
curl -i -X POST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'

```

Get all:
```
curl -G http://localhost:8086/query --data-urlencode "q=SELECT * FROM motion" --data-urlencode "db=training"
```

Drop:
```
curl -X POST http://localhost:8086/query --data-urlencode "q=DROP SERIES FROM motion" --data-urlencode "db=training"
```
