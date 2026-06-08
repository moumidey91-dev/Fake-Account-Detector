import os
import pickle
import numpy as np
import pandas as pd
from flask import Flask, render_template, request, jsonify

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
app = Flask(__name__)

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
        except Exception as e:
            print(f"Failed to load XGBoost model: {e}. Falling back to Random Forest.")
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

def generate_explanation(data):
    """
    Generate dynamic user-friendly explanations/risk flags based on user input.
    """
    explanations = []
    
    username = data.get('username', '')
    followers = safe_int(data.get('followers', 0))
    following = safe_int(data.get('following', 0))
    posts = safe_int(data.get('posts', 0))
    bio_len = safe_int(data.get('bio_length', 0))
    has_profile_pic = safe_int(data.get('profile_pic', 0))
    is_verified = safe_int(data.get('verified', 0))
    account_age = safe_int(data.get('account_age', 0))
    engagement_rate = safe_float(data.get('engagement_rate', 0.0))
    
    # Calculate digit ratio for username
    digits = sum(c.isdigit() for c in username)
    digit_ratio = digits / len(username) if len(username) > 0 else 0
    
    # 1. High Following Ratio
    if followers > 0:
        ratio = following / followers
        if ratio > 5.0 and following > 300:
            explanations.append({
                "type": "danger",
                "title": "High Following-to-Follower Ratio",
                "desc": f"This account follows {ratio:.1f}x more users than it has followers, typical of spam/follow-unfollow bots."
            })
    elif following > 150:
        explanations.append({
            "type": "danger",
            "title": "High Following with 0 Followers",
            "desc": "The account is following others but has zero followers, which is highly suspicious."
        })
        
    # 2. Low Engagement
    if engagement_rate < 0.8 and posts > 10:
        explanations.append({
            "type": "warning",
            "title": "Extremely Low Engagement",
            "desc": f"An engagement rate of {engagement_rate}% is very low, indicating inactive or bot followers."
        })
    elif engagement_rate > 25.0 and followers > 1000:
        explanations.append({
            "type": "warning",
            "title": "Abnormally High Engagement",
            "desc": f"An engagement rate of {engagement_rate}% is unnaturally high, suggesting potential engagement pod or bot activity."
        })
        
    # 3. Incomplete Profile
    if has_profile_pic == 0:
        explanations.append({
            "type": "danger",
            "title": "No Profile Picture",
            "desc": "Accounts without profile pictures are statistically 70% more likely to be fake/spam bots."
        })
    if bio_len == 0:
        explanations.append({
            "type": "warning",
            "title": "Empty Bio Details",
            "desc": "No bio text provided. Real accounts typically include some introductory text or details."
        })
    elif bio_len < 8:
        explanations.append({
            "type": "info",
            "title": "Short Bio Length",
            "desc": "The bio description is extremely short, which is common in quick-setup dummy accounts."
        })
        
    # 4. Account Age
    if account_age < 30:
        explanations.append({
            "type": "danger",
            "title": "Newly Created Account",
            "desc": f"Created only {account_age} days ago. Newly registered profiles are highly correlated with automated campaign bots."
        })
    elif account_age > 1000 and is_verified == 1:
        explanations.append({
            "type": "success",
            "title": "Established & Verified Account",
            "desc": f"Account is {account_age} days old and verified, indicating a highly credible public profile."
        })
        
    # 5. Username digit ratio
    if digit_ratio > 0.3:
        explanations.append({
            "type": "danger",
            "title": "High Number of Digits in Username",
            "desc": f"Username contains {digit_ratio*100:.0f}% numeric digits, indicating it may have been auto-generated by a script."
        })
        
    # 6. Verification Status
    if is_verified == 1:
        explanations.append({
            "type": "success",
            "title": "Official Verified Status",
            "desc": "Verified badges are awarded to authentic public figures, brands, or entities, drastically reducing risk."
        })
        
    # 7. Low Posts but High Followings
    if posts == 0 and following > 50:
        explanations.append({
            "type": "danger",
            "title": "Zero Posts, Active Follower Activity",
            "desc": f"No content has been posted, yet the account is actively following {following} users."
        })
        
    # If no flags were triggered, add a default positive observation
    if not explanations:
        explanations.append({
            "type": "success",
            "title": "Balanced Account Parameters",
            "desc": "No anomalous metrics detected. Followers, following, age, and posts conform to normal user patterns."
        })
        
    return explanations

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html', model_used=model_used)

@app.route('/detect', methods=['GET', 'POST'])
def detect():
    global xgboost_model, rf_model, model_used
    data = {}
    
    # Lazy reload models if they failed to load earlier (in case requirements were just installed)
    if xgboost_model is None and rf_model is None:
        load_models()
        
    if request.method == 'GET':
        return render_template('detect.html', model_loaded=(xgboost_model is not None or rf_model is not None), form_data=data)
    
    # POST - Predict
    try:
        # Get data from JSON request or form request
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
            
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
        
        if xgboost_model is not None:
            try:
                # XGBoost predict_proba returns [prob_real, prob_fake]
                probs = xgboost_model.predict_proba(features_df)
                probability_fake = float(probs[0][1])
                prediction = int(xgboost_model.predict(features_df)[0])
                active_model = "XGBoost Classifier"
            except Exception as e:
                print(f"Inference with XGBoost failed: {e}. Trying Random Forest fallback.")
                if rf_model is not None:
                    probs = rf_model.predict_proba(features_df)
                    probability_fake = float(probs[0][1])
                    prediction = int(rf_model.predict(features_df)[0])
                    active_model = "Random Forest (Fallback)"
        elif rf_model is not None:
            probs = rf_model.predict_proba(features_df)
            probability_fake = float(probs[0][1])
            prediction = int(rf_model.predict(features_df)[0])
            active_model = "Random Forest (Fallback)"
        else:
            # Simple heuristic prediction if no models could be loaded at all
            active_model = "Heuristic Rule Engine (No ML Model Loaded)"
            # Basic fallback calculation:
            score = 0.0
            if profile_pic == 0: score += 0.25
            if verified == 1: score -= 0.4
            if account_age < 30: score += 0.3
            if followers > 0 and following / (followers + 1) > 5.0: score += 0.25
            if bio_length == 0: score += 0.15
            if username_digit_ratio > 0.3: score += 0.2
            probability_fake = max(0.0, min(1.0, 0.2 + score))
            prediction = 1 if probability_fake >= 0.5 else 0

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
        explanations = generate_explanation(data)
        
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
        
        if request.is_json:
            return jsonify(response_data)
        else:
            return render_template('detect.html', 
                                   result=response_data, 
                                   form_data=data, 
                                   model_loaded=True)
            
    except Exception as e:
        error_msg = f"An error occurred during prediction: {str(e)}"
        print(error_msg)
        if request.is_json:
            return jsonify({"success": False, "error": error_msg}), 400
        else:
            return render_template('detect.html', 
                                   error=error_msg, 
                                   model_loaded=(xgboost_model is not None or rf_model is not None),
                                   form_data=data)

if __name__ == '__main__':
    # Running locally
    app.run(debug=True, host='0.0.0.0', port=5000)
