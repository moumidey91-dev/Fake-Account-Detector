import os
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Try to import xgboost, handle gracefully if not installed yet
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    xgb = None
    XGBOOST_AVAILABLE = False

def generate_synthetic_data(n_samples=2000):
    np.random.seed(42)
    half_samples = n_samples // 2
    
    # --- Real Profiles Dataset ---
    real_data = {
        'username_len': np.random.normal(11, 3, half_samples).clip(4, 30).astype(int),
        'username_digit_ratio': np.random.beta(1, 8, half_samples), # mostly low digit count
        'followers': np.random.lognormal(7.5, 1.5, half_samples).clip(50, 1000000).astype(int),
        'following': np.random.lognormal(6.2, 0.8, half_samples).clip(10, 5000).astype(int),
        'posts': np.random.lognormal(5.0, 1.2, half_samples).clip(5, 5000).astype(int),
        'bio_len': np.random.normal(65, 35, half_samples).clip(0, 150).astype(int),
        'has_profile_pic': np.random.choice([1, 0], size=half_samples, p=[0.97, 0.03]),
        'is_verified': np.random.choice([1, 0], size=half_samples, p=[0.08, 0.92]),
        'account_age': np.random.normal(1200, 600, half_samples).clip(30, 5000).astype(int), # days
        'engagement_rate': np.random.uniform(1.5, 12.0, half_samples), # %
        'is_fake': np.zeros(half_samples, dtype=int)
    }
    
    # --- Fake Profiles Dataset ---
    fake_data = {
        'username_len': np.random.normal(15, 4, half_samples).clip(5, 30).astype(int),
        'username_digit_ratio': np.random.beta(3, 2, half_samples), # higher ratio of numbers
        'followers': np.random.lognormal(4.5, 1.2, half_samples).clip(0, 15000).astype(int),
        'following': np.random.lognormal(6.8, 1.0, half_samples).clip(0, 7500).astype(int),
        # Fake profiles often follow a lot of people but have few followers
        'posts': np.random.lognormal(2.1, 1.5, half_samples).clip(0, 100).astype(int),
        'bio_len': np.random.normal(15, 18, half_samples).clip(0, 150).astype(int),
        'has_profile_pic': np.random.choice([1, 0], size=half_samples, p=[0.40, 0.60]),
        'is_verified': np.zeros(half_samples, dtype=int), # fake accounts are never verified in our synthetic set
        'account_age': np.random.normal(75, 90, half_samples).clip(1, 730).astype(int), # recently created
        'engagement_rate': np.random.uniform(0.0, 1.2, half_samples), # low engagement
        'is_fake': np.ones(half_samples, dtype=int)
    }
    
    df_real = pd.DataFrame(real_data)
    df_fake = pd.DataFrame(fake_data)
    
    # Adjust following/followers relation for fakes to make it more obvious
    # e.g., low followers, very high following
    mask = df_fake['followers'] < 200
    df_fake.loc[mask, 'following'] = (df_fake.loc[mask, 'following'] * 1.8).astype(int)
    
    df = pd.concat([df_real, df_fake], ignore_index=True)
    # Shuffle dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df

def train_models():
    print("Generating synthetic social media profile dataset...")
    df = generate_synthetic_data(3000)
    
    X = df.drop('is_fake', axis=1)
    y = df['is_fake']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    print("\n--- Training Random Forest (Fallback Model) ---")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=8)
    rf_model.fit(X_train, y_train)
    
    y_pred_rf = rf_model.predict(X_test)
    print(f"Random Forest Accuracy: {accuracy_score(y_test, y_pred_rf):.4f}")
    print(classification_report(y_test, y_pred_rf))
    
    # Save Random Forest
    rf_path = os.path.join(models_dir, 'rf_model.pkl')
    with open(rf_path, 'wb') as f:
        pickle.dump(rf_model, f)
    print(f"Random Forest model saved to: {rf_path}")
    
    # Train XGBoost if available
    if XGBOOST_AVAILABLE:
        print("\n--- Training XGBoost Model ---")
        xgb_model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42,
            eval_metric='logloss'
        )
        xgb_model.fit(X_train, y_train)
        
        y_pred_xgb = xgb_model.predict(X_test)
        print(f"XGBoost Accuracy: {accuracy_score(y_test, y_pred_xgb):.4f}")
        print(classification_report(y_test, y_pred_xgb))
        
        # Save XGBoost model
        xgb_path = os.path.join(models_dir, 'xgboost_model.json')
        xgb_model.save_model(xgb_path)
        print(f"XGBoost model saved to: {xgb_path}")
    else:
        print("\n[WARNING] XGBoost is not available/installed. Skipping XGBoost training.")
        print("XGBoost will be trained when the training script is run within the virtual environment where requirements are installed.")

if __name__ == '__main__':
    train_models()
