# from sqlalchemy.orm import Session
# from app import models, schemas

# def create_category(db: Session, category: schemas.CategoryCreate):
#     cat = models.PreferenceCategory(name=category.name)
#     db.add(cat)
#     db.commit()
#     db.refresh(cat)
#     return cat

# def create_preference(db: Session, pref: schemas.PreferenceCreate):
#     preference = models.UserPreference(**pref.dict())
#     db.add(preference)
#     db.commit()
#     db.refresh(preference)
#     return preference

# def get_user_preferences(db: Session, user_id: int):
#     return db.query(models.UserPreference).filter(
#         models.UserPreference.user_id == user_id
#     ).all()


from sqlalchemy.orm import Session 
from app import models, schemas

def create_category(db: Session, category: schemas.PreferencesCategoryCreate): 
    cat = models.PreferencesCategory(name=category.name) 
    db.add(cat) 
    db.commit() 
    db.refresh(cat) 
    return cat

def get_categories(db: Session): 
    return db.query(models.PreferencesCategory).all()

def create_preference(db: Session, pref: schemas.PreferencesCreate): 
    preference = models.Preferences(**pref.dict()) 
    db.add(preference) 
    db.commit() 
    db.refresh(preference) 
    return preference

def get_preferences(db: Session): 
    return db.query(models.Preferences).all()

def get_preference(db: Session, preference_id: int): 
    return db.query(models.Preferences).filter( 
        models.Preferences.id == preference_id 
    ).first()
    
def update_preference(db: Session, preference_id: int, pref: schemas.PreferencesCreate): 
    db_pref = db.query(models.Preferences).filter( 
        models.Preferences.id == preference_id 
    ).first() 
    if not db_pref: 
        return None 
    for key, value in pref.dict().items(): 
        setattr(db_pref, key, value) 
    db.commit() 
    db.refresh(db_pref) 
    return db_pref

def delete_preference(db: Session, preference_id: int): 
    db_pref = db.query(models.Preferences).filter( 
        models.Preferences.id == preference_id 
        ).first() 
    if not db_pref: 
        return None 
    db.delete(db_pref) 
    db.commit() 
    return db_pref