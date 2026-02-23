from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression

app = Flask(__name__)


@app.post("/predict")
def predict():
    payload = request.get_json(force=True)
    attendance = float(payload.get("attendance", 0))
    last_3_scores = payload.get("last_3_scores", [0, 0, 0])
    previous_gpa = float(payload.get("previous_gpa", 0))

    x = np.array([[i + 1] for i in range(len(last_3_scores))])
    y = np.array(last_3_scores, dtype=float)
    if len(last_3_scores) < 2:
        predicted_score = float(y.mean()) if len(y) > 0 else 0.0
    else:
        lin = LinearRegression()
        lin.fit(x, y)
        predicted_score = float(lin.predict(np.array([[len(last_3_scores) + 1]]))[0])

    predicted_score = max(0.0, min(100.0, predicted_score * 0.7 + attendance * 0.1 + previous_gpa * 10 * 0.2))

    x_risk = np.array([
        [55, 50, 5.0],
        [80, 78, 8.0],
        [62, 58, 6.0],
        [40, 45, 4.0],
        [90, 88, 9.0],
    ])
    y_risk = np.array([1, 0, 1, 1, 0])
    clf = LogisticRegression()
    clf.fit(x_risk, y_risk)
    risk_probability = float(clf.predict_proba(np.array([[attendance, predicted_score, previous_gpa]]))[0][1])

    return jsonify({
        "predictedScore": round(predicted_score, 2),
        "riskProbability": round(risk_probability, 4)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
