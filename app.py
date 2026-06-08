import os
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

def safe_int(val, default=0):
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

def safe_float(val, default=0.0):
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


# Initialize Flask App
import sys
try:
    cli = sys.modules['flask.cli']
    cli.show_server_banner = lambda *x: None
    pass

app = Flask(__name__)
CORS(app)

# Paths to models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
XGB_PATH = os.path.join(MODELS_DIR, 'xgboost_model.json')
RF_PATH = os.path.join(MODELS_DIR, 'rf_model.pkl')

# Global variables for models
xgboost_model = None
rf_model = None
model_used = None

def load_models():
    global xgboost_model, rf_model, model_used
    
    # Try to load XGBoost first
    if os.path.exists(XGB_PATH):
        try:
            import xgboost as xgb
            xgboost_model = xgb.XGBClassifier()
            xgboost_model.load_model(XGB_PATH)
            model_used = "XGBoost Classifier"
            print("Successfully loaded XGBoost model.")
        except Exception:
            # Silently fallback so user doesn't see a scary error
            xgboost_model = None

    # Load Random Forest if XGBoost failed or is unavailable
    if xgboost_model is None:
        if os.path.exists(RF_PATH):
            try:
                with open(RF_PATH, 'rb') as f:
                    rf_model = pickle.load(f)
                model_used = "Random Forest (Fallback)"
                print("Successfully loaded Random Forest model.")
            except Exception as e:
                print(f"Failed to load Random Forest model: {e}")
                rf_model = None
        else:
            print("Random Forest model file not found.")

# Initial model load
load_models()

def generate_explanation(features_df, model, is_fake):
    """
    Generate dynamic user-friendly explanations/risk flags based on SHAP values.
    """
    explanations = []
    
    try:
        if model is None:
            raise ValueError("No model provided for explanation.")
            
        import shap
        # Calculate SHAP values
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(features_df)
        
        # Determine the appropriate SHAP values array depending on the model output
        if isinstance(shap_values, list):
            sv = shap_values[1][0]
        elif len(shap_values.shape) == 3:
            # Sometimes returns (1, num_features, num_classes)
            sv = shap_values[0, :, 1]
        elif len(shap_values.shape) == 2:
            sv = shap_values[0]
        else:
            sv = shap_values
            
        feature_names = features_df.columns.tolist()
        feature_values = features_df.iloc[0].to_dict()
        
        contributions = list(zip(feature_names, sv))
        contributions.sort(key=lambda x: abs(x[1]), reverse=True)
        
        friendly_names = {
            'username_len': 'Username Length',
            'username_digit_ratio': 'Digits in Username',
            'followers': 'Followers Count',
            'following': 'Following Count',
            'posts': 'Number of Posts',
            'bio_len': 'Bio Length',
            'has_profile_pic': 'Profile Picture Status',
            'is_verified': 'Verification Status',
            'account_age': 'Account Age',
            'engagement_rate': 'Engagement Rate'
        }
        
        for feature_name, shap_val in contributions[:4]:
            if abs(shap_val) < 0.05:
                continue
                
            value = feature_values[feature_name]
            # Format value nicely if it's a float
            if isinstance(value, float):
                value = f"{value:.2f}"
                
            f_name = friendly_names.get(feature_name, feature_name)
            
            if is_fake:
                if shap_val > 0:
                    explanations.append({
                        "type": "danger",
                        "title": f"Suspicious {f_name}",
                        "desc": f"The ML model flagged the value '{value}' for {f_name} as highly indicative of a fake account."
                    })
                else:
                    explanations.append({
                        "type": "info",
                        "title": f"Normal {f_name}",
                        "desc": f"Despite being flagged as fake, the {f_name} ('{value}') appears somewhat normal."
                    })
            else:
                if shap_val < 0:
                    explanations.append({
                        "type": "success",
                        "title": f"Authentic {f_name}",
                        "desc": f"The ML model determined the value '{value}' for {f_name} strongly indicates a real account."
                    })
                else:
                    explanations.append({
                        "type": "warning",
                        "title": f"Unusual {f_name}",
                        "desc": f"While predicted as real, the {f_name} ('{value}') was slightly unusual for a typical real account."
                    })
                    
        if not explanations:
             explanations.append({
                "type": "info",
                "title": "Machine Learning Assessment",
                "desc": "The ML model analyzed all features collectively without any single overwhelming factor."
             })
             
    except Exception as e:
        print(f"SHAP explanation failed: {e}")
        explanations.append({
            "type": "warning",
            "title": "Explanation Engine Error",
            "desc": "The ML model made a prediction, but detailed explanations could not be generated dynamically."
        })
        
    return explanations

@app.route('/detect', methods=['POST'])
def detect():
    global xgboost_model, rf_model, model_used
    data = {}
    
    # Lazy reload models if they failed to load earlier
    if xgboost_model is None and rf_model is None:
        load_models()
    
    # POST - Predict
    try:
        # Get data from JSON request
        if not request.is_json:
            return jsonify({"success": False, "error": "Request must be JSON"}), 400
            
        data = request.get_json()
            
        username = data.get('username', '')
        followers = safe_int(data.get('followers', 0))
        following = safe_int(data.get('following', 0))
        posts = safe_int(data.get('posts', 0))
        bio_length = safe_int(data.get('bio_length', 0))
        profile_pic = safe_int(data.get('profile_pic', 0))
        verified = safe_int(data.get('verified', 0))
        account_age = safe_int(data.get('account_age', 0))
        engagement_rate = safe_float(data.get('engagement_rate', 0.0))
        
        # Preprocess features
        # 1. username len
        username_len = len(username)
        # 2. username digit ratio
        digits = sum(c.isdigit() for c in username)
        username_digit_ratio = digits / username_len if username_len > 0 else 0.0
        
        # Prepare feature vector matching training columns:
        # ['username_len', 'username_digit_ratio', 'followers', 'following', 'posts', 'bio_len', 
        #  'has_profile_pic', 'is_verified', 'account_age', 'engagement_rate']
        feature_dict = {
            'username_len': [username_len],
            'username_digit_ratio': [username_digit_ratio],
            'followers': [followers],
            'following': [following],
            'posts': [posts],
            'bio_len': [bio_length],
            'has_profile_pic': [profile_pic],
            'is_verified': [verified],
            'account_age': [account_age],
            'engagement_rate': [engagement_rate]
        }
        
        features_df = pd.DataFrame(feature_dict)
        
        # Inference using available model
        probability_fake = 0.5
        prediction = 0
        active_model = "None Loaded"
        current_model_instance = None
        
        if xgboost_model is not None:
            try:
                # XGBoost predict_proba returns [prob_real, prob_fake]
                probs = xgboost_model.predict_proba(features_df)
                probability_fake = float(probs[0][1])
                prediction = int(xgboost_model.predict(features_df)[0])
                active_model = "XGBoost Classifier"
                current_model_instance = xgboost_model
            except Exception as e:
                print(f"Inference with XGBoost failed: {e}. Trying Random Forest fallback.")
                if rf_model is not None:
                    probs = rf_model.predict_proba(features_df)
                    probability_fake = float(probs[0][1])
                    prediction = int(rf_model.predict(features_df)[0])
                    active_model = "Random Forest (Fallback)"
                    current_model_instance = rf_model
                else:
                    raise Exception("No Machine Learning model available. Please train a model first.")
        elif rf_model is not None:
            probs = rf_model.predict_proba(features_df)
            probability_fake = float(probs[0][1])
            prediction = int(rf_model.predict(features_df)[0])
            active_model = "Random Forest (Fallback)"
            current_model_instance = rf_model
        else:
            raise Exception("No Machine Learning model available. Please train a model first.")

        # Calculate result details
        is_fake = (prediction == 1)
        label = "Fake Profile" if is_fake else "Real Profile"
        
        # Confidence Score
        confidence = probability_fake if is_fake else (1.0 - probability_fake)
        confidence_pct = round(confidence * 100, 2)
        
        # Risk Level
        # prob_fake governs the overall risk
        if probability_fake < 0.15:
            risk_level = "Low"
            risk_class = "risk-low"
        elif probability_fake < 0.50:
            risk_level = "Moderately Low"
            risk_class = "risk-mod-low"
        elif probability_fake < 0.80:
            risk_level = "Medium"
            risk_class = "risk-medium"
        else:
            risk_level = "High"
            risk_class = "risk-high"
            
        # Explanations
        explanations = generate_explanation(features_df, current_model_instance, is_fake)
        
        response_data = {
            "success": True,
            "prediction": label,
            "is_fake": is_fake,
            "confidence": f"{confidence_pct}%",
            "confidence_raw": confidence,
            "risk_level": risk_level,
            "risk_class": risk_class,
            "explanations": explanations,
            "model_used": active_model
        }
        
        
        return jsonify(response_data)
            
    except Exception as e:
        error_msg = f"An error occurred during prediction: {str(e)}"
        print(error_msg)
        return jsonify({"success": False, "error": error_msg}), 400

if __name__ == '__main__':
    # Running locally
    app.run(debug=True, host='0.0.0.0', port=5000)
