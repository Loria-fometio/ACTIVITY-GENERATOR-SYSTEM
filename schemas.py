from pydantic import BaseModel
from typing import List, Optional

# ---- PreferencesCategory ----
class PreferencesCategoryBase(BaseModel):
    name: str

class PreferencesCategoryCreate(PreferencesCategoryBase):
    pass

class PreferencesCategory(PreferencesCategoryBase):
    id: int
    class Config:
        from_attributes = True

# ---- Preferences ----
class PreferencesBase(BaseModel):
    value: str

class PreferencesCreate(PreferencesBase):
    user_id: int
    category_id: int

class Preferences(PreferencesBase):
    id: int
    user_id: int
    category: PreferencesCategory
    class Config:
        from_attributes = True