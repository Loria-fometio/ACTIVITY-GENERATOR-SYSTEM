from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# ----------------------------
# Table des catégories
# ----------------------------
class PreferencesCategory(Base):
    __tablename__ = "preferences_categories"  # obligatoire !

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)

    # Relation avec Preferences
    preferences = relationship("Preferences", back_populates="category")


# ----------------------------
# Table des préférences
# ----------------------------
class Preferences(Base):
    __tablename__ = "preferences" # obligatoire !

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # juste un entier
    category_id = Column(Integer, ForeignKey("preferences_categories.id"))
    value = Column(String)

    # Relation avec la catégorie
    category = relationship("PreferencesCategory", back_populates="preferences")