# Day 4 — Machine Learning

## Project Overview

This project is a beginner-level introduction to Machine Learning using Python.

The practical goal was to understand the basic workflow of building a prediction model using a small student dataset.

The model uses study hours and attendance as input features and predicts whether a student is likely to pass or fail.

This project was created as a learning exercise to understand the basic machine learning workflow.

---

## Problem Statement

The objective is to build a simple classification model that learns from previous student data and predicts the pass/fail result for a new student.

Input:

- Study Hours
- Attendance

Output:

- Pass
- Fail

---

## Features

- Load student data from CSV
- Separate input features and target
- Split data into training and testing sets
- Train a Decision Tree classification model
- Calculate model accuracy
- Save the trained model
- Make predictions for new student data

---

## Technology Stack

- Python
- Pandas
- Scikit-learn
- Joblib

---

## Project Structure

```text
day-04/
├── dataset/
│   └── student_data.csv
│
├── ml/
│   ├── 01_load_data.py
│   ├── 02_prepare_data.py
│   ├── 03_train_model.py
│   ├── 04_predict.py
│   └── student_model.pkl
│
└── README.md