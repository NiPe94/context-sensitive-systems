import requests
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn.feature_selection import RFE
# classifier = GaussianNB()
# classifier = AdaBoostClassifier()
classifier = SVC(kernel="linear") #rbf

response = requests.get("http://localhost:3000/influent")
dict = response.json()['results'][0]['series'][0]
df = pd.DataFrame(data=dict['values'], columns=dict['columns'])
df = df.drop(['time'], axis=1)

X = []
y = []
class_names = []

skip_count = 0

def windowing(window):
    row = [
        window['alpha'].mean(),
        window['beta'].mean(),
        window['gamma'].mean(),
        window['x'].mean(),
        window['y'].mean(),
        window['z'].mean(),

        window['alpha'].var(),
        window['beta'].var(),
        window['gamma'].var(),
        window['x'].var(),
        window['y'].var(),
        window['z'].var()
        ]
    return row

for i, activity in enumerate(list(set([a.strip() for a in list(np.array(df['activity']))]))):
    class_names.append(activity)
    print(activity)
    for index in np.arange(0, (df['activity'] == activity).shape[0], 20):
        window = df[(df['activity'] == activity)][index:index+20]
        if window.shape[0] < 1:
            # print(index, index+20, window.shape[0])
            skip_count += 1
            continue;

        X.append(windowing(window))

        # y.append(df[(df['activity'] == 'Display Bottom')][:20]['activity'].head(1).values[0])
        y.append(i)

X_data = pd.DataFrame(X)
y_data = np.array(y)
X_train, X_test, y_train, y_test = train_test_split(X_data, y_data, test_size=0.2, random_state=42)
classifier.fit(X_train, y_train)

# RFE
selector = RFE(classifier, 3, step=1)
selector = selector.fit(X_train, y_train)
print("Selector Support: {}".format(selector.support_))
print("Selector Ranking: {}".format(selector.ranking_))

y_pred = classifier.predict(X_test)

print("Accuracy={}".format(accuracy_score(y_test, y_pred)))
