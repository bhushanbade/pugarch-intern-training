import joblib

model = joblib.load("day-04/ml/student_model.pkl")

study_hours = float(input("Enter study hours: "))
attendance = float(input("Enter attendance percentage: "))

prediction = model.predict([[study_hours, attendance]])

if prediction[0] == 1:
    print("Prediction: Student is likely to PASS.")
else:
    print("Prediction: Student is likely to FAIL.")