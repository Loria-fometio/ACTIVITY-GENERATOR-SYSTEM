# from fastapi import APIRouter

# router = APIRouter(prefix="/preferences", tags=["Preferences"])



# @router.get("/")
# def test_preferences():
#     return {"message":"Preferences route works"}


from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session
from database import get_db 
import crud.preferences_crud as crud 
import schemas

router = APIRouter(tags=["Preferences & Categories"])

# -----------------------------
# Catégories 
# -----------------------------

@router.post("/categories/", response_model=schemas.PreferencesCategory) 
def create_category(category: schemas.PreferencesCategoryCreate, db: Session = Depends(get_db)): 
    return crud.create_category(db, category)

@router.get("/categories/", response_model=list[schemas.PreferencesCategory]) 
def read_categories(db: Session = Depends(get_db)): 
    return crud.get_categories(db)

# ----------------------------- 
# Préférences 
# -----------------------------

@router.post("/preferences/", response_model=schemas.Preferences)
def create_preference(preference: schemas.PreferencesCreate, db: Session = Depends(get_db)): 
    return crud.create_preference(db, preference) 

@router.get("/preferences/", response_model=list[schemas.Preferences]) 
def read_preferences(db: Session = Depends(get_db)): 
    return crud.get_preferences(db)

@router.get("/preferences/{preference_id}", response_model=schemas.Preferences) 
def read_preference(preference_id: int, db: Session = Depends(get_db)): 
    pref = crud.get_preference(db, preference_id) 
    if not pref: 
        raise HTTPException(status_code=404, detail="Preference not found") 
    return pref

@router.put("/preferences/{preference_id}", response_model=schemas.Preferences) 
def update_preference(preference_id: int, preference: schemas.PreferencesCreate, db: Session = Depends(get_db)): 
    db_pref = crud.update_preference(db, preference_id, preference) 
    if not db_pref: 
        raise HTTPException(status_code=404, detail="Preference not found")
    return db_pref

@router.delete("/preferences/{preference_id}") 
def delete_preference(preference_id: int, db: Session = Depends(get_db)): 
    db_pref = crud.delete_preference(db, preference_id) 
    if not db_pref: 
        raise HTTPException(status_code=404, detail="Preference not found") 
    return {"message": "Preference deleted successfully"}