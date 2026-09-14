import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import joblib

df = pd.read_csv("day-04/dataset/student_data.csv")

X = df[["study_hours", "attendance"]]
y = df["pass"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = DecisionTreeClassifier(random_state=42)

model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)

print("Model trained successfully.")
print("Model Accuracy:", accuracy)

joblib.dump(model, "day-04/ml/student_model.pkl")

print("Model saved successfully.")