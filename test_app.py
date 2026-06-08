import os
import pickle
import pandas as pd
import shap
import warnings
warnings.filterwarnings('ignore')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RF_PATH = os.path.join(BASE_DIR, 'models', 'rf_model.pkl')

print("Loading RF model...")
with open(RF_PATH, 'rb') as f:
    rf_model = pickle.load(f)

# Create dummy features
feature_dict = {
    'username_len': [15],
    'username_digit_ratio': [0.5],
    'followers': [100],
    'following': [5000],
    'posts': [0],
    'bio_len': [5],
    'has_profile_pic': [0],
    'is_verified': [0],
    'account_age': [10],
    'engagement_rate': [0.0]
}
features_df = pd.DataFrame(feature_dict)

print("Predicting...")
probs = rf_model.predict_proba(features_df)
prediction = int(rf_model.predict(features_df)[0])
print(f"Prediction: {prediction}, Probs: {probs}")

print("Explaining with SHAP...")
try:
    explainer = shap.TreeExplainer(rf_model)
    shap_values = explainer.shap_values(features_df)
    print(f"SHAP Values type: {type(shap_values)}")
    if isinstance(shap_values, list):
        print("SHAP Values is list")
        print(f"List length: {len(shap_values)}")
        print(f"Item 0 shape: {shap_values[0].shape}")
    elif hasattr(shap_values, 'shape'):
        print(f"SHAP Values shape: {shap_values.shape}")
        
    # App logic test
    if isinstance(shap_values, list):
        sv = shap_values[1][0]
    elif len(shap_values.shape) == 3:
        sv = shap_values[0, :, 1]
    elif len(shap_values.shape) == 2:
        sv = shap_values[0]
    else:
        sv = shap_values
        
    print(f"Final SV shape: {sv.shape}")
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
