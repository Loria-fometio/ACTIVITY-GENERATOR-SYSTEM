from sqlalchemy import create_engine, inspect 
# ⚠️ adapte l’URL avec ton utilisateur, mot de passe et base 
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root@localhost:3306/activity_planner"
engine = create_engine(SQLALCHEMY_DATABASE_URL) 
# Inspecteur pour voir les tables 
insp = inspect(engine) 
print("Base connectée :", engine.url.database) 
print("Tables disponibles :", insp.get_table_names()) 
# Vérifier la structure de la table preferences_categories 
if "preferences_categories" in insp.get_table_names(): 
    columns = insp.get_columns("preferences_categories")
print("Colonnes de preferences_categories :") 
for col in columns: print(f"- {col['name']} ({col['type']})") 
else: print("La table preferences_categories n'existe pas dans cette base.")